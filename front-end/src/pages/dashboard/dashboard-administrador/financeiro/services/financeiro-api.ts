import { financeiroDashboardControllerObter } from "../../../../../api/dashboard-administrativo-financeiro/dashboard-administrativo-financeiro";
import {
  executarHttp,
  registro,
  numero,
  texto,
} from "../../services/administracao-api";

function data(valor: unknown) {
  const resultado = texto(valor);
  if (!Number.isFinite(Date.parse(resultado)))
    throw new Error("Data financeira inválida.");
  return resultado;
}
function itens<T>(
  valor: unknown,
  validar: (item: Record<string, unknown>) => T,
) {
  if (!Array.isArray(valor)) throw new Error("Lista financeira inválida.");
  return valor.map((i) => validar(registro(i)));
}
export async function consultarFinanceiro(
  inicioDe: string,
  inicioAte: string,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      financeiroDashboardControllerObter({ inicioDe, inicioAte }, { signal }),
    ),
  );
  const indicadores = registro(obj.indicadores),
    periodo = registro(obj.periodo);
  return {
    geradoEm: data(obj.geradoEm),
    periodo: {
      inicioDe: data(periodo.inicioDe),
      inicioAte: data(periodo.inicioAte),
    },
    indicadores: {
      receita: numero(indicadores.receita),
      variacaoReceitaPercentual: numero(indicadores.variacaoReceitaPercentual),
      comissoes: numero(indicadores.comissoes),
      comissoesAPagar: numero(indicadores.comissoesAPagar),
    },
    fluxoSemanal: itens(obj.fluxoSemanal, (i) => ({
      inicio: data(i.inicio),
      receita: numero(i.receita),
    })),
    movimentacoesRecentes: itens(obj.movimentacoesRecentes, (i) => ({
      id: numero(i.id),
      data: data(i.data),
      descricao: texto(i.descricao),
      categoria: texto(i.categoria),
      valor: numero(i.valor),
      status: texto(i.status),
    })),
    comissoesPorBarbeiro: itens(obj.comissoesPorBarbeiro, (i) => {
      const status = registro(i.porStatus);
      return {
        id: numero(i.id),
        barbeiro: texto(i.barbeiro),
        total: numero(i.total),
        porStatus: {
          PREVISTA: numero(status.PREVISTA),
          LIBERADA: numero(status.LIBERADA),
          PAGA: numero(status.PAGA),
          CANCELADA: numero(status.CANCELADA),
          ESTORNADA: numero(status.ESTORNADA),
        },
      };
    }),
  };
}
