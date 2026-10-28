import { barbeiroDashboardControllerObter } from "../../../../../api/dashboard-administrativo-barbeiros/dashboard-administrativo-barbeiros";
import {
  executarHttp,
  lista,
  registro,
  numero,
  texto,
} from "../../services/administracao-api";

export async function consultarBarbeiros(
  busca: string,
  status: string,
  pagina: number,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      barbeiroDashboardControllerObter(
        {
          busca,
          status: status
            ? (status as "ATIVO" | "INATIVO" | "AFASTADO")
            : undefined,
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
    if (!["ATIVO", "INATIVO", "AFASTADO"].includes(String(i.status)))
      throw new Error("Status profissional inválido.");
    return {
      id: numero(i.id),
      nome: texto(i.nome),
      filial: texto(i.filial),
      status: texto(i.status),
      atendimentosHoje: numero(i.atendimentosHoje),
      receitaMes: numero(i.receitaMes),
      comissoesRegistradasMes: numero(i.comissoesRegistradasMes),
      comissoesAPagar: numero(i.comissoesAPagar),
    };
  });
  return {
    ...dados,
    geradoEm,
    indicadores: {
      ativos: numero(indicadores.ativos),
      atendimentosMes: numero(indicadores.atendimentosMes),
      comissoesAPagar: numero(indicadores.comissoesAPagar),
    },
  };
}
