import { agendamentoControllerBuscar, agendamentoControllerCriar, agendamentoControllerAtualizar, agendamentoControllerRemover, agendamentoControllerListarHistorico } from '../../../../../api/agendamentos/agendamentos';
import { clienteControllerListar } from '../../../../../api/clientes/clientes';
import { catalogoPublicoControllerFiliais, catalogoPublicoControllerBarbeiros, catalogoPublicoControllerServicos } from '../../../../../api/catálogo-público/catálogo-público';
import type { AtualizarAgendamentoDto } from '../../../../../api/models';
import { executarHttp, registro, texto, numero, lista } from '../../services/administracao-api';
async function todas(operacao: (pagina: number) => Promise<{ status: number; data: unknown; headers: Headers }>) {
 const itens: Record<string, unknown>[] = [];
 for (let pagina = 1; ; pagina++) {
  const r = lista(await executarHttp(() => operacao(pagina)), registro); itens.push(...r.data);
  if (pagina >= r.meta.totalPaginas) return itens;
  if (!r.data.length || r.meta.pagina !== pagina) throw new Error('Consulta incompleta. Atualize as opções.');
 }
}
export async function opcoesAgenda(signal?: AbortSignal) {
 const [clientes, filiais, barbeiros, servicos] = await Promise.all([
  todas(pagina => clienteControllerListar({ pagina, limite: 100 }, { signal })),
  todas(pagina => catalogoPublicoControllerFiliais({ pagina, limite: 100 }, { signal })),
  todas(pagina => catalogoPublicoControllerBarbeiros({ pagina, limite: 100 }, { signal })),
  todas(pagina => catalogoPublicoControllerServicos({ pagina, limite: 100 }, { signal })),
 ]);
 const opcao = (id: unknown, nome: unknown) => ({ valor: String(numero(id)), rotulo: texto(nome) });
 return { clientes: clientes.map(c => opcao(c.id, registro(c.usuario).nome)), filiais: filiais.map(f => opcao(f.id, f.nome)), barbeiros: barbeiros.map(b => ({ ...opcao(b.id, b.nomeProfissional), idFilial: numero(b.idFilial) })), servicos: servicos.map(s => opcao(s.id, s.nome)) };
}
export function dataHoraLocal(valor: string) {
 const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(valor));
 const v = (nome: string) => p.find(i => i.type === nome)!.value;
 return `${v('year')}-${v('month')}-${v('day')}T${v('hour')}:${v('minute')}`;
}
export async function buscarAgendamentoAdmin(id: number) {
 const a = registro(await executarHttp(() => agendamentoControllerBuscar(id)));
 return { clienteNome: texto(registro(registro(a.cliente).usuario).nome), barbeiroNome: texto(registro(a.barbeiro).nomeProfissional), filialNome: texto(registro(a.filial).nome), inicio: dataHoraLocal(texto(a.inicioPrevisto)), observacaoCliente: typeof a.observacaoCliente === 'string' ? a.observacaoCliente : '', observacaoInterna: typeof a.observacaoInterna === 'string' ? a.observacaoInterna : '', status: texto(a.status), idCliente: String(numero(a.idCliente)), idBarbeiro: String(numero(a.idBarbeiro)), idFilial: String(numero(a.idFilial)), servicoIds: '', servicosAtuais: Array.isArray(a.servicos) ? a.servicos.map(i => texto(registro(registro(i).servico).nome)).join(' + ') : '' };
}
export function salvarAgendamentoAdmin(id: number | null, d: Record<string, string>) {
 if (id === null) return executarHttp(() => agendamentoControllerCriar({ idCliente: Number(d.idCliente), idBarbeiro: Number(d.idBarbeiro), idFilial: Number(d.idFilial), inicio: `${d.inicio}:00-03:00`, servicoIds: d.servicoIds.split(',').filter(Boolean).map(Number), origem: 'ADMINISTRADOR', observacaoCliente: d.observacaoCliente, observacaoInterna: d.observacaoInterna }), 201);
 const payload: AtualizarAgendamentoDto = { observacaoCliente: d.observacaoCliente, observacaoInterna: d.observacaoInterna };
 // Enviar só mudanças efetivas evita recalcular preços históricos e revalidar agenda em uma simples transição.
 const original = JSON.parse(d.original) as Record<string, string>;
 for (const campo of ['idCliente', 'idBarbeiro', 'idFilial'] as const) if (d[campo] !== original[campo]) payload[campo] = Number(d[campo]);
 if (d.inicio !== original.inicio) payload.inicio = `${d.inicio}:00-03:00`;
 if (d.servicoIds) payload.servicoIds = d.servicoIds.split(',').map(Number);
 if (d.status && d.status !== original.status) payload.status = d.status as AtualizarAgendamentoDto['status'];
 if (payload.status === 'CANCELADO') payload.motivoCancelamento = d.motivoCancelamento;
 return executarHttp(() => agendamentoControllerAtualizar(id, payload));
}
export async function carregarAgendamento(id: number) { const a = await buscarAgendamentoAdmin(id); return { ...a, original: JSON.stringify(a) }; }
export const excluirAgendamentoAdmin = (id: number) => executarHttp(() => agendamentoControllerRemover(id));
export async function historicoAgenda(id: number, pagina: number, signal?: AbortSignal) {
 return lista(await executarHttp(() => agendamentoControllerListarHistorico(id, { pagina, limite: 10 }, { signal })), item => { const h = registro(item); return { id: numero(h.id), status: texto(h.statusNovo), data: texto(h.dataAlteracao), responsavel: texto(registro(h.usuarioResponsavel).nome) }; });
}
