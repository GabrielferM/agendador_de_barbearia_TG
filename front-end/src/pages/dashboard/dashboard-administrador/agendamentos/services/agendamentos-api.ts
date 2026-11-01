import { agendamentoDashboardControllerObter } from "../../../../../api/dashboard-administrativo-agendamentos/dashboard-administrativo-agendamentos";
import { chaveDiaBarbearia } from "../calendario";
import type { DiaAgenda } from "../types";
import { ItemAgendaDashboardDtoStatus } from "../../../../../api/models/itemAgendaDashboardDtoStatus";

export class ErroAgenda extends Error {
  readonly status: number;
  readonly esperarAte?: number;

  constructor(status: number, headers: Headers) {
    super(status === 429
      ? "Limite de requisições atingido. Aguarde antes de tentar novamente."
      : status === 403
        ? "Você não possui permissão para consultar agendamentos."
        : "Não foi possível carregar os agendamentos. Tente novamente.");
    this.name = "ErroAgenda";
    this.status = status;
    if (status === 429) {
      const valor = headers.get("Retry-After");
      const segundos = valor?.trim() ? Number(valor) : NaN;
      const prazo = Number.isFinite(segundos) && segundos >= 0
        ? Date.now() + segundos * 1000
        : valor && !Number.isFinite(segundos) ? Date.parse(valor) : NaN;
      this.esperarAte = Number.isFinite(prazo) ? prazo : Date.now() + 60_000;
    }
  }
}

export async function consultarAgenda(inicioDe: string, inicioAte: string, signal?: AbortSignal): Promise<DiaAgenda[]> {
  const resposta = await agendamentoDashboardControllerObter({ inicioDe, inicioAte }, { signal }).catch(() => {
    throw new Error("Não foi possível carregar os agendamentos. Tente novamente.");
  });
  if (resposta.status !== 200) {
    throw new ErroAgenda(resposta.status, resposta.headers);
  }
  const dados = resposta.data;
  const diasEsperados = Math.round((Date.parse(inicioAte) - Date.parse(inicioDe)) / 86_400_000) + 1;
  const ids = new Set<number>();
  if (!dados || !Array.isArray(dados.dias) || dados.dias.length !== diasEsperados ||
    !dados.dias.every((dia, indice) => {
      const dataEsperada = new Date(Date.parse(inicioDe) + indice * 86_400_000).toISOString().slice(0, 10);
      return dia && dia.data === dataEsperada && typeof dia.rotulo === "string" &&
        Array.isArray(dia.agendamentos) && dia.agendamentos.every(item => {
          if (!item || ids.has(item.id)) return false;
          ids.add(item.id);
          return Number.isInteger(item.id) && typeof item.inicio === "string" && Number.isFinite(Date.parse(item.inicio)) &&
            chaveDiaBarbearia(new Date(item.inicio)) === dia.data &&
            typeof item.cliente === "string" && typeof item.barbeiro === "string" &&
            Array.isArray(item.servicos) && item.servicos.every(servico => typeof servico === "string") &&
            Object.values(ItemAgendaDashboardDtoStatus).includes(item.status);
        });
    })) {
    throw new Error("A API retornou uma agenda inválida. Tente novamente.");
  }
  return dados.dias.map(dia => ({ ...dia, agendamentos: [...dia.agendamentos].sort(
    (a, b) => Date.parse(a.inicio) - Date.parse(b.inicio) || a.id - b.id,
  ) }));
}
