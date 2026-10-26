import { apiBaseUrl } from "../client";
import { httpClient } from "../http-client";
import type {
  DashboardAdministradorResposta,
  DashboardBarbeiroResposta,
  IndicadorDashboard,
} from "./models";

export class ErroDashboard extends Error {
  readonly status: number;

  constructor(status: number) {
    super(
      status === 403
        ? "Você não possui permissão para visualizar este painel."
        : "Não foi possível carregar o painel.",
    );
    this.name = "ErroDashboard";
    this.status = status;
  }
}

async function obter<T>(caminho: string, signal?: AbortSignal): Promise<T> {
  const resposta = await httpClient<{ data: T; status: number }>(
    `${apiBaseUrl}${caminho}`,
    { method: "GET", signal },
  );
  if (resposta.status !== 200) throw new ErroDashboard(resposta.status);
  return resposta.data;
}

export const obterDashboardAdministrador = async (signal?: AbortSignal) => {
  const dados = await obter<DashboardAdministradorResposta>(
    "/dashboard/administrador",
    signal,
  );
  validarDashboardAdministrador(dados);
  return dados;
};
export const obterDashboardBarbeiro = () =>
  obter<DashboardBarbeiroResposta>("/dashboard/barbeiro");

function validarDashboardAdministrador(dados: DashboardAdministradorResposta) {
  const numero = (valor: unknown) =>
    typeof valor === "number" && Number.isFinite(valor) && valor >= 0;
  const data = (valor: unknown) =>
    typeof valor === "string" && Number.isFinite(Date.parse(valor));
  const indicador = (valor: IndicadorDashboard | undefined) =>
    valor &&
    numero(valor.valor) &&
    typeof valor.variacaoPercentual === "number" &&
    Number.isFinite(valor.variacaoPercentual);
  if (
    !dados ||
    !data(dados.geradoEm) ||
    !indicador(dados.agendamentosHoje) ||
    !indicador(dados.receitaHoje) ||
    ![
      dados.clientesAtivos,
      dados.novosClientesNoMes,
      dados.barbeirosAtivos,
    ].every(numero) ||
    !Array.isArray(dados.receitaUltimosSeteDias) ||
    !dados.receitaUltimosSeteDias.every(
      (i) => i && data(i.data) && numero(i.valor),
    ) ||
    !Array.isArray(dados.servicosNoMes) ||
    !dados.servicosNoMes.every(
      (i) =>
        i &&
        typeof i.nome === "string" &&
        numero(i.quantidade) &&
        numero(i.percentual) &&
        i.percentual <= 100,
    ) ||
    !Array.isArray(dados.desempenhoBarbeiros) ||
    !dados.desempenhoBarbeiros.every(
      (i) =>
        i &&
        numero(i.id) &&
        typeof i.nome === "string" &&
        numero(i.atendimentos) &&
        numero(i.receita),
    ) ||
    !Array.isArray(dados.agendamentosRecentes) ||
    !dados.agendamentosRecentes.every(
      (i) =>
        i &&
        numero(i.id) &&
        data(i.inicio) &&
        typeof i.cliente === "string" &&
        typeof i.barbeiro === "string" &&
        typeof i.status === "string" &&
        Array.isArray(i.servicos) &&
        i.servicos.every((s) => typeof s === "string"),
    )
  ) {
    throw new Error("A API retornou um painel inválido. Tente novamente.");
  }
}
