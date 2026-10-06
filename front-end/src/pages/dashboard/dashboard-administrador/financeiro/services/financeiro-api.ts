import {
  comissaoControllerBuscar,
  comissaoControllerListar,
} from "../../../../../api/comissões/comissões";
import type { ComissaoControllerListarParams } from "../../../../../api/models";
import {
  consultarDashboard,
  dinheiroValido,
  executarHttp,
  objeto,
  paginaValida,
  type Registro,
} from "../../services/operacoes-api";
export interface PainelFinanceiro {
  periodo: { inicioDe: string; inicioAte: string };
  indicadores: {
    receita: number;
    variacaoReceitaPercentual: number;
    comissoes: number;
  };
  fluxoSemanal: { inicio: string; receita: number }[];
  movimentacoesRecentes: {
    id: number;
    descricao: string;
    data: string;
    valor: number;
  }[];
  comissoesPorBarbeiro: {
    id: number;
    barbeiro: string;
    total: number;
    porStatus: Record<string, number>;
  }[];
}
export async function painelFinanceiro(
  filtros: { inicioDe?: string; inicioAte?: string },
  signal?: AbortSignal,
) {
  const valor = await consultarDashboard("financeiro", filtros, signal);
  if (
    !objeto(valor) ||
    !objeto(valor.periodo) ||
    typeof valor.periodo.inicioDe !== "string" ||
    typeof valor.periodo.inicioAte !== "string" ||
    !objeto(valor.indicadores) ||
    !["receita", "variacaoReceitaPercentual", "comissoes"].every(
      (chave) =>
        typeof (valor.indicadores as Registro)[chave] === "number" &&
        dinheiroValido((valor.indicadores as Registro)[chave]),
    ) ||
    !Array.isArray(valor.fluxoSemanal) ||
    !valor.fluxoSemanal.every(
      (item) =>
        objeto(item) &&
        typeof item.inicio === "string" &&
        dinheiroValido(item.receita),
    ) ||
    !Array.isArray(valor.movimentacoesRecentes) ||
    !valor.movimentacoesRecentes.every(
      (item) =>
        objeto(item) &&
        Number.isInteger(item.id) &&
        typeof item.descricao === "string" &&
        typeof item.data === "string" &&
        dinheiroValido(item.valor),
    ) ||
    !Array.isArray(valor.comissoesPorBarbeiro) ||
    !valor.comissoesPorBarbeiro.every(
      (item) =>
        objeto(item) &&
        Number.isInteger(item.id) &&
        typeof item.barbeiro === "string" &&
        dinheiroValido(item.total) &&
        objeto(item.porStatus) &&
        Object.values(item.porStatus).every(dinheiroValido),
    )
  )
    throw new Error("Painel financeiro inválido.");
  return valor as unknown as PainelFinanceiro;
}
function comissaoValida(item: Registro) {
  return (
    Number.isInteger(item.id) &&
    typeof item.status === "string" &&
    dinheiroValido(item.valorComissao) &&
    dinheiroValido(item.baseCalculo) &&
    dinheiroValido(item.percentualAplicado) &&
    typeof item.dataGeracao === "string" &&
    objeto(item.barbeiro) &&
    objeto(item.barbeiro.usuario) &&
    typeof item.barbeiro.usuario.nome === "string" &&
    objeto(item.agendamentoServico) &&
    Number.isInteger(item.agendamentoServico.idAgendamento)
  );
}
export async function listarComissoes(
  params: ComissaoControllerListarParams,
  signal?: AbortSignal,
) {
  return paginaValida(
    await executarHttp(() => comissaoControllerListar(params, { signal })),
    comissaoValida,
  );
}
export async function detalheComissao(id: number, signal?: AbortSignal) {
  const valor = await executarHttp(() =>
    comissaoControllerBuscar(id, { signal }),
  );
  if (!objeto(valor) || !comissaoValida(valor))
    throw new Error("Comissão inválida.");
  return valor;
}
