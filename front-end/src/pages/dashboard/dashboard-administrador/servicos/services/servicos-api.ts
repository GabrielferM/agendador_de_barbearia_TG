import type {
  CriarServicoDto,
  AtualizarServicoDto,
} from "../../../../../api/models";
import type { Registro } from "../../services/operacoes-api";
import {
  servicoControllerBuscar,
  servicoControllerCriar,
  servicoControllerAtualizar,
  servicoControllerRemover,
} from "../../../../../api/serviços/serviços";
import {
  consultarDashboard,
  dinheiroValido,
  executarHttp,
  objeto,
  paginaValida,
} from "../../services/operacoes-api";
export async function listarServicos(
  filtros: { pagina: number; busca?: string; ativo?: string },
  signal?: AbortSignal,
) {
  const valor = await consultarDashboard(
    "servicos",
    { ...filtros, limite: 10 },
    signal,
  );
  const pagina = paginaValida(
    valor,
    (item) =>
      typeof item.nome === "string" &&
      typeof item.ativo === "boolean" &&
      Number.isInteger(item.duracaoMinutos) &&
      dinheiroValido(item.preco) &&
      dinheiroValido(item.receitaMes) &&
      Number.isInteger(item.realizadosMes),
  );
  if (
    !objeto(pagina.indicadores) ||
    !Number.isInteger(pagina.indicadores.ativos) ||
    !dinheiroValido(pagina.indicadores.ticketMedio)
  )
    throw new Error("Indicadores inválidos.");
  return pagina;
}
export async function buscarServico(id: number, signal?: AbortSignal) {
  const valor = await executarHttp(() =>
    servicoControllerBuscar(id, { signal }),
  );
  if (
    !objeto(valor) ||
    !Number.isInteger(valor.id) ||
    typeof valor.nome !== "string" ||
    typeof valor.ativo !== "boolean" ||
    !dinheiroValido(valor.precoBase) ||
    !Number.isInteger(valor.duracaoMinutos)
  )
    throw new Error("Cadastro inválido.");
  return valor;
}

export async function salvarServico(id: number | null, dados: Registro) {
  const valor = await executarHttp(
    () =>
      id === null
        ? servicoControllerCriar(dados as unknown as CriarServicoDto)
        : servicoControllerAtualizar(id, dados as AtualizarServicoDto),
    id === null ? 201 : 200,
  );
  if (
    !objeto(valor) ||
    !Number.isInteger(valor.id) ||
    typeof valor.nome !== "string" ||
    !dinheiroValido(valor.precoBase)
  )
    throw new Error("Resposta inválida da gravação.");
  return valor;
}
export const excluirServico = (id: number) =>
  executarHttp(() => servicoControllerRemover(id), 200);
