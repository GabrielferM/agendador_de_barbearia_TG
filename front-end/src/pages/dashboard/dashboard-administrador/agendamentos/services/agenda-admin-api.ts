import { agendamentoControllerListar, agendamentoControllerBuscar, agendamentoControllerAtualizar } from '../../../../../api/agendamentos/agendamentos';
import type { AgendamentoControllerListarParams } from '../../../../../api/models';
import { agendamentoValido } from '../../../../agendamento/services/agendamento-api';
import type { AgendamentoBarbeiro } from '../../../dashboard-barbeiro/agenda/services/agenda-barbeiro-api';
import { executarHttp, objeto, paginaValida, type Registro } from '../../services/operacoes-api';
export type AtendimentoAdmin = AgendamentoBarbeiro & { observacaoInterna?: string | null };
function adaptar(valor: unknown): AtendimentoAdmin {
  if (!agendamentoValido(valor) || !objeto(valor) || !objeto(valor.cliente) || !objeto(valor.cliente.usuario) || typeof valor.cliente.usuario.nome !== 'string') throw new Error('Detalhe inválido.');
  return { ...valor, cliente: { id: Number(valor.cliente.id), nome: valor.cliente.usuario.nome } } as unknown as AtendimentoAdmin;
}
export async function listarAgendaAdmin(params: AgendamentoControllerListarParams, signal?: AbortSignal) {
  const resposta = paginaValida(await executarHttp(() => agendamentoControllerListar(params, { signal })), agendamentoValido);
  return { ...resposta, data: resposta.data.map(adaptar) };
}
export const detalheAdmin = async (id: number, signal?: AbortSignal) => adaptar(await executarHttp(() => agendamentoControllerBuscar(id, { signal })));
export const atualizarAdmin = async (id: number, status: AgendamentoBarbeiro['status'], motivoCancelamento?: string) => adaptar(await executarHttp(() => agendamentoControllerAtualizar(id, { status, ...(motivoCancelamento ? { motivoCancelamento } : {}) })));
export async function gradeAdmin(params: AgendamentoControllerListarParams, signal?: AbortSignal) {
  const itens: AtendimentoAdmin[] = []; let atual = 1; let total: number;
  do { const resposta = await listarAgendaAdmin({ ...params, pagina: atual, limite: 100 }, signal); if (resposta.meta.total > 5000) throw new Error('Período muito amplo. Use a lista paginada ou reduza o período da grade.'); itens.push(...resposta.data); total = resposta.meta.totalPaginas; atual++; } while (atual <= total);
  return itens;
}
export const nomeSeletor = (item: Registro) => String(item.nome);
