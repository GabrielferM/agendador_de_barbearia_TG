import { agendamentoDashboardControllerObter } from "../../../../../api/dashboard-administrativo-agendamentos/dashboard-administrativo-agendamentos";
import type { DiaAgenda } from "../types";
import { ItemAgendaDashboardDtoStatus } from "../../../../../api/models/itemAgendaDashboardDtoStatus";

export async function consultarAgenda(inicioDe: string, inicioAte: string, signal?: AbortSignal): Promise<DiaAgenda[]> {
  const resposta = await agendamentoDashboardControllerObter({ inicioDe, inicioAte }, { signal }).catch(() => {
    throw new Error("Não foi possível carregar os agendamentos. Tente novamente.");
  });
  if (resposta.status !== 200) {
    throw new Error(resposta.status === 403
      ? "Você não possui permissão para consultar agendamentos."
      : "Não foi possível carregar os agendamentos. Tente novamente.");
  }
  const dados = resposta.data;
  const diasEsperados = Math.round((Date.parse(inicioAte) - Date.parse(inicioDe)) / 86_400_000) + 1;
  if (!dados || !Array.isArray(dados.dias) || dados.dias.length !== diasEsperados ||
    !dados.dias.every((dia, indice) => {
      const dataEsperada = new Date(Date.parse(inicioDe) + indice * 86_400_000).toISOString().slice(0, 10);
      return dia && dia.data === dataEsperada && typeof dia.rotulo === "string" &&
        Array.isArray(dia.agendamentos) && dia.agendamentos.every(item => item &&
          Number.isInteger(item.id) && typeof item.inicio === "string" && Number.isFinite(Date.parse(item.inicio)) &&
          typeof item.cliente === "string" && typeof item.barbeiro === "string" &&
          Array.isArray(item.servicos) && item.servicos.every(servico => typeof servico === "string") &&
          Object.values(ItemAgendaDashboardDtoStatus).includes(item.status));
    })) {
    throw new Error("A API retornou uma agenda inválida. Tente novamente.");
  }
  return dados.dias;
}
