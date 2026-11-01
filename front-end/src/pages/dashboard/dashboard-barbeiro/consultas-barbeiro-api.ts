import {
  dashboardBarbeiroControllerClientes,
  dashboardBarbeiroControllerServicos,
  dashboardBarbeiroControllerHistorico,
} from "../../../api/dashboard-do-barbeiro/dashboard-do-barbeiro";
import type {
  ClienteBarbeiroDto,
  ServicoBarbeiroDto,
  DashboardBarbeiroControllerHistoricoParams,
  MetaPaginacaoDto,
} from "../../../api/models";
import { ErroAgendamento } from "../../agendamento/services/agendamento-api";
import {
  validarAtendimento,
  type AgendamentoBarbeiro,
} from "./agenda/services/agenda-barbeiro-api";
const objeto = (v: unknown): v is Record<string, unknown> =>
  !!v && typeof v === "object";
const inteiro = (v: unknown) => Number.isSafeInteger(v) && Number(v) >= 0;
const data = (v: unknown) =>
  v === null || (typeof v === "string" && Number.isFinite(Date.parse(v)));
const dinheiro = (v: unknown) =>
  typeof v === "string" && /^\d+\.\d{2}$/.test(v) && Number.isFinite(Number(v));
function conferir<T>(
  resposta: { status: number; data: unknown },
  validar: (v: unknown) => boolean,
) {
  if (resposta.status !== 200)
    throw new ErroAgendamento(
      resposta.status,
      resposta.status === 403
        ? "Você não possui acesso a esta consulta."
        : resposta.status === 429
          ? "Muitas consultas. Aguarde antes de tentar novamente."
          : "Não foi possível carregar os dados.",
    );
  const v = resposta.data;
  if (
    !objeto(v) ||
    !Array.isArray(v.data) ||
    !v.data.every(validar) ||
    !objeto(v.meta) ||
    !inteiro(v.meta.total) ||
    !inteiro(v.meta.totalPaginas) ||
    !inteiro(v.meta.pagina) ||
    Number(v.meta.pagina) < 1 ||
    !inteiro(v.meta.limite) ||
    Number(v.meta.limite) < 1
  )
    throw new Error("Resposta inválida da consulta.");
  return v as { data: T[]; meta: MetaPaginacaoDto };
}
export async function consultarClientes(
  params: { pagina: number; limite: number; busca?: string },
  signal?: AbortSignal,
) {
  return conferir<ClienteBarbeiroDto>(
    await dashboardBarbeiroControllerClientes(params, { signal }),
    (v) =>
      objeto(v) &&
      inteiro(v.id) &&
      typeof v.nome === "string" &&
      data(v.ultimoAtendimento) &&
      data(v.proximoAgendamento) &&
      inteiro(v.atendimentosConcluidos),
  );
}
export async function consultarServicos(
  params: {
    pagina: number;
    limite: number;
    busca?: string;
    inicioDe: string;
    inicioAte: string;
  },
  signal?: AbortSignal,
) {
  return conferir<ServicoBarbeiroDto>(
    await dashboardBarbeiroControllerServicos(params, { signal }),
    (v) =>
      objeto(v) &&
      inteiro(v.id) &&
      typeof v.nome === "string" &&
      (v.descricao === null || typeof v.descricao === "string") &&
      dinheiro(v.precoBase) &&
      dinheiro(v.receita) &&
      inteiro(v.quantidade) &&
      inteiro(v.duracaoMinutos) &&
      typeof v.ativo === "boolean",
  );
}
export async function consultarHistorico(
  params: DashboardBarbeiroControllerHistoricoParams,
  signal?: AbortSignal,
) {
  return conferir<AgendamentoBarbeiro>(
    await dashboardBarbeiroControllerHistorico(params, { signal }),
    validarAtendimento,
  );
}
