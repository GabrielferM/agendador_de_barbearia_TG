import {
  agendamentoControllerBuscar,
  agendamentoControllerListar,
  agendamentoControllerAtualizar,
} from "../../../../../api/agendamentos/agendamentos";
import type {
  AgendamentoRespostaDto,
  AgendamentoControllerListarParams,
  MetaPaginacaoDto,
} from "../../../../../api/models";
import { executarHttp } from "../../../../../api/operacao-http";
export type AgendamentoBarbeiro = AgendamentoRespostaDto & {
  cliente: { id: number; nome: string };
  inicioReal?: string | null;
  fimReal?: string | null;
};
const objeto = (valor: unknown): valor is Record<string, unknown> =>
  !!valor && typeof valor === "object";
function validar(valor: unknown): valor is AgendamentoBarbeiro {
  return (
    objeto(valor) &&
    Number.isInteger(valor.id) &&
    typeof valor.status === "string" &&
    typeof valor.inicioPrevisto === "string" &&
    Number.isFinite(Date.parse(valor.inicioPrevisto)) &&
    typeof valor.fimPrevisto === "string" &&
    Number.isFinite(Date.parse(valor.fimPrevisto)) &&
    objeto(valor.cliente) &&
    typeof valor.cliente.nome === "string" &&
    objeto(valor.filial) &&
    typeof valor.filial.nome === "string" &&
    objeto(valor.filial.endereco) &&
    objeto(valor.barbeiro) &&
    typeof valor.barbeiro.nomeProfissional === "string" &&
    Array.isArray(valor.servicos) &&
    valor.servicos.every(
      (item: unknown) =>
        objeto(item) &&
        typeof item.precoAplicado === "string" &&
        Number.isFinite(Number(item.precoAplicado)) &&
        typeof item.subtotal === "string" &&
        Number.isFinite(Number(item.subtotal)) &&
        Number.isInteger(item.quantidade) &&
        Number.isInteger(item.duracaoAplicadaMinutos) &&
        objeto(item.servico) &&
        typeof item.servico.nome === "string",
    )
  );
}
export async function listarAgenda(
  filtros: AgendamentoControllerListarParams,
  signal?: AbortSignal,
) {
  const valor = await executarHttp(() =>
    agendamentoControllerListar(filtros, { signal }),
  );
  if (
    !objeto(valor) ||
    !Array.isArray(valor.data) ||
    !valor.data.every(validar) ||
    !objeto(valor.meta) ||
    !Number.isInteger(valor.meta.total) ||
    !Number.isInteger(valor.meta.totalPaginas) ||
    !Number.isInteger(valor.meta.pagina)
  )
    throw new Error("Resposta inválida da agenda.");
  return valor as { data: AgendamentoBarbeiro[]; meta: MetaPaginacaoDto };
}
export async function buscarAtendimento(id: number, signal?: AbortSignal) {
  const valor = await executarHttp(() =>
    agendamentoControllerBuscar(id, { signal }),
  );
  if (!validar(valor)) throw new Error("Resposta inválida do atendimento.");
  return valor;
}

export async function atualizarAtendimento(
  id: number,
  status: AgendamentoRespostaDto["status"],
  motivoCancelamento?: string,
) {
  const valor = await executarHttp(() =>
    agendamentoControllerAtualizar(id, {
      status,
      ...(motivoCancelamento ? { motivoCancelamento } : {}),
    }),
  );
  if (!validar(valor))
    throw new Error(
      "Resposta inválida do atendimento. Consulte a agenda antes de repetir a ação.",
    );
  return valor;
}
