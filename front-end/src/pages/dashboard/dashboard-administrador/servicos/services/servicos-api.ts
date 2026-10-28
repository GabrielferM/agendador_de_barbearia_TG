import { servicosDashboardControllerObter } from "../../../../../api/dashboard-administrativo-serviços/dashboard-administrativo-serviços";
import {
  executarHttp,
  lista,
  registro,
  numero,
  texto,
} from "../../services/administracao-api";

export async function consultarServicos(
  busca: string,
  status: string,
  pagina: number,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      servicosDashboardControllerObter(
        {
          busca,
          ativo: status ? (status as "true" | "false") : undefined,
          pagina,
          limite: 12,
        },
        { signal },
      ),
    ),
  );
  const indicadores = registro(obj.indicadores);
  const geradoEm = texto(obj.geradoEm);
  if (!Number.isFinite(Date.parse(geradoEm)))
    throw new Error("Data de atualização inválida.");
  const dados = lista(obj, (item) => {
    const i = registro(item);
    if (typeof i.ativo !== "boolean")
      throw new Error("Status do serviço inválido.");
    return {
      id: numero(i.id),
      nome: texto(i.nome),
      duracaoMinutos: numero(i.duracaoMinutos),
      preco: numero(i.preco),
      ativo: i.ativo as boolean,
      realizadosMes: numero(i.realizadosMes),
      receitaMes: numero(i.receitaMes),
    };
  });
  return {
    ...dados,
    geradoEm,
    indicadores: {
      ativos: numero(indicadores.ativos),
      maisRealizado:
        indicadores.maisRealizado === null
          ? null
          : texto(indicadores.maisRealizado),
      ticketMedio: numero(indicadores.ticketMedio),
    },
  };
}
