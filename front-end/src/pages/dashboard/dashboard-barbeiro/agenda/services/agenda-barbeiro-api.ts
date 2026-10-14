import { agendamentoControllerBuscar, agendamentoControllerListar } from '../../../../../api/agendamentos/agendamentos';
import type { AgendamentoRespostaDto, AgendamentoControllerListarParams, MetaPaginacaoDto } from '../../../../../api/models';
import { ErroAgendamento } from '../../../../agendamento/services/agendamento-api';
export type AgendamentoBarbeiro = AgendamentoRespostaDto & { cliente: { id: number; nome: string } };
function conferir(resposta: { status: number; data: unknown }) {
  if (resposta.status !== 200) throw new ErroAgendamento(resposta.status,
    resposta.status === 403 ? 'Você não tem acesso a esta agenda.' : resposta.status === 429 ? 'Muitas consultas. Aguarde antes de tentar novamente.' : 'Não foi possível consultar a agenda.');
  return resposta.data;
}
const objeto = (valor: unknown): valor is Record<string, unknown> => !!valor && typeof valor === 'object';
function validar(valor: unknown): valor is AgendamentoBarbeiro {
  return objeto(valor) && Number.isInteger(valor.id) && typeof valor.status === 'string'
    && typeof valor.inicioPrevisto === 'string' && Number.isFinite(Date.parse(valor.inicioPrevisto))
    && typeof valor.fimPrevisto === 'string' && Number.isFinite(Date.parse(valor.fimPrevisto))
    && objeto(valor.cliente) && typeof valor.cliente.nome === 'string'
    && objeto(valor.filial) && typeof valor.filial.nome === 'string' && objeto(valor.filial.endereco)
    && objeto(valor.barbeiro) && typeof valor.barbeiro.nomeProfissional === 'string'
    && Array.isArray(valor.servicos) && valor.servicos.every((item: unknown) => objeto(item)
      && typeof item.precoAplicado === 'string' && Number.isFinite(Number(item.precoAplicado))
      && typeof item.subtotal === 'string' && Number.isFinite(Number(item.subtotal))
      && Number.isInteger(item.quantidade) && Number.isInteger(item.duracaoAplicadaMinutos)
      && objeto(item.servico) && typeof item.servico.nome === 'string');
}
export async function listarAgenda(filtros: AgendamentoControllerListarParams, signal?: AbortSignal) {
  const valor = conferir(await agendamentoControllerListar(filtros, { signal }));
  if (!objeto(valor) || !Array.isArray(valor.data) || !valor.data.every(validar) || !objeto(valor.meta)
    || !Number.isInteger(valor.meta.total) || !Number.isInteger(valor.meta.totalPaginas) || !Number.isInteger(valor.meta.pagina))
    throw new Error('Resposta inválida da agenda.');
  return valor as { data: AgendamentoBarbeiro[]; meta: MetaPaginacaoDto };
}
export async function buscarAtendimento(id: number, signal?: AbortSignal) {
  const valor = conferir(await agendamentoControllerBuscar(id, { signal }));
  if (!validar(valor)) throw new Error('Resposta inválida do atendimento.');
  return valor;
}
