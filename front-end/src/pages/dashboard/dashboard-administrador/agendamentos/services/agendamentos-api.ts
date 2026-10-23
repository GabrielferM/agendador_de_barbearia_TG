import { agendamentoDashboardControllerObter, agendamentoDashboardControllerClientes } from '../../../../../api/dashboard-administrativo-agendamentos/dashboard-administrativo-agendamentos';
import { agendamentoControllerBuscar, agendamentoControllerCriar, agendamentoControllerAtualizar, agendamentoControllerRemover, agendamentoControllerListarHistorico, agendamentoControllerHorarios } from '../../../../../api/agendamentos/agendamentos';
import { catalogoPublicoControllerBarbeiros, catalogoPublicoControllerServicos } from '../../../../../api/catálogo-público/catálogo-público';
import type { AtualizarAgendamentoDto, CriarAgendamentoDto, AgendamentoDashboardControllerObterParams } from '../../../../../api/models';
import { executarHttp, registro, texto, numero, lista } from '../../services/administracao-api';
export const STATUS_AGENDA = ['PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'] as const;
export const TRANSICOES: Record<string, string[]> = { PENDENTE: ['CONFIRMADO', 'CANCELADO'], CONFIRMADO: ['EM_ATENDIMENTO', 'CANCELADO', 'NAO_COMPARECEU'], EM_ATENDIMENTO: ['CONCLUIDO'], CONCLUIDO: [], CANCELADO: [], NAO_COMPARECEU: [] };
export function dataLocal(iso: string) { const d = new Date(iso); return new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(d).replace(' ', 'T'); }
export function deslocar(data: string, dias: number) { const d = new Date(data + 'T12:00:00-03:00'); d.setUTCDate(d.getUTCDate() + dias); return dataLocal(d.toISOString()).slice(0, 10); }
export function periodoAgenda(data: string, visao: string) {
 if (visao === 'Dia') return { inicioDe: data, inicioAte: data };
 if (visao === 'Semana') { const d = new Date(data + 'T12:00:00-03:00'), inicioDe = deslocar(data, -((d.getUTCDay() + 6) % 7)); return { inicioDe, inicioAte: deslocar(inicioDe, 6) }; }
 const inicioDe = data.slice(0, 7) + '-01', d = new Date(inicioDe + 'T12:00:00-03:00'); d.setUTCMonth(d.getUTCMonth() + 1); return { inicioDe, inicioAte: deslocar(dataLocal(d.toISOString()).slice(0, 10), -1) };
}
export async function consultarAgenda(filtros: AgendamentoDashboardControllerObterParams, signal?: AbortSignal) {
 const o = registro(await executarHttp(() => agendamentoDashboardControllerObter(filtros, { signal })));
 if (!Array.isArray(o.dias)) throw new Error('Agenda inválida.');
 return o.dias.map(valor => { const d = registro(valor); if (!Array.isArray(d.agendamentos)) throw new Error('Agenda inválida.'); return { data: texto(d.data), rotulo: texto(d.rotulo), agendamentos: d.agendamentos.map(valor => { const a = registro(valor); if (!Array.isArray(a.servicos) || !a.servicos.every(s => typeof s === 'string')) throw new Error('Serviços inválidos.'); const status = texto(a.status); if (!(STATUS_AGENDA as readonly string[]).includes(status)) throw new Error('Status inválido.'); return { id: numero(a.id), inicio: texto(a.inicio), fim: texto(a.fim), cliente: texto(a.cliente), barbeiro: texto(a.barbeiro), servicos: a.servicos as string[], status, total: numero(a.total) }; }) }; });
}
export async function clientesAgenda(busca: string, pagina: number, signal?: AbortSignal) {
 return lista(await executarHttp(() => agendamentoDashboardControllerClientes({ busca, pagina, limite: 10 }, { signal })), v => { const c = registro(v); return { valor: String(numero(c.id)), rotulo: texto(c.nome) }; });
}
export async function catalogoAgenda(idFilial?: number, signal?: AbortSignal) {
 async function todos(tipo: 'barbeiros' | 'servicos') {
  const itens: { valor: string; rotulo: string }[] = [];
  for (let pagina = 1;; pagina++) { const r = lista(await executarHttp(() => tipo === 'barbeiros' ? catalogoPublicoControllerBarbeiros({ pagina, limite: 100, idFilial }, { signal }) : catalogoPublicoControllerServicos({ pagina, limite: 100 }, { signal })), v => { const o = registro(v); return { valor: String(numero(o.id)), rotulo: texto(tipo === 'barbeiros' ? o.nomeProfissional : o.nome) }; }); itens.push(...r.data); if (pagina >= r.meta.totalPaginas) return itens; }
 }
 const [barbeiros, servicos] = await Promise.all([todos('barbeiros'), todos('servicos')]); return { barbeiros, servicos };
}
export interface ItemEditor { idServico: number; quantidade: number; desconto: number }
export interface DetalheAgenda { id: number; idCliente: number; idBarbeiro: number; idFilial: number; nomeCliente: string; nomeBarbeiro: string; nomeFilial: string; inicio: string; status: string; observacaoCliente: string; observacaoInterna: string; servicos: ItemEditor[]; nomesServicos: Record<string, string> }
export async function buscarAgendamento(id: number): Promise<DetalheAgenda> {
 const a = registro(await executarHttp(() => agendamentoControllerBuscar(id))), cliente = registro(a.cliente), usuario = registro(cliente.usuario), barbeiro = registro(a.barbeiro), filial = registro(a.filial);
 if (!Array.isArray(a.servicos)) throw new Error('Itens inválidos.');
 const nomesServicos: Record<string, string> = {};
 const servicos = a.servicos.map(v => { const s = registro(v); nomesServicos[String(s.idServico)] = texto(registro(s.servico).nome); if (!Number.isFinite(Number(s.desconto))) throw new Error('Desconto inválido.'); return { idServico: numero(s.idServico), quantidade: numero(s.quantidade), desconto: Number(s.desconto) }; });
 return { id: numero(a.id), idCliente: numero(a.idCliente), idBarbeiro: numero(a.idBarbeiro), idFilial: numero(a.idFilial), nomeCliente: texto(usuario.nome), nomeBarbeiro: texto(barbeiro.nomeProfissional), nomeFilial: texto(filial.nome), inicio: dataLocal(texto(a.inicioPrevisto)), status: texto(a.status), observacaoCliente: typeof a.observacaoCliente === 'string' ? a.observacaoCliente : '', observacaoInterna: typeof a.observacaoInterna === 'string' ? a.observacaoInterna : '', servicos, nomesServicos };
}
export const gravarAgendamento = (id: number | null, dados: CriarAgendamentoDto | AtualizarAgendamentoDto) => id === null ? executarHttp(() => agendamentoControllerCriar(dados as CriarAgendamentoDto), 201) : executarHttp(() => agendamentoControllerAtualizar(id, dados));
export const removerAgendamento = (id: number) => executarHttp(() => agendamentoControllerRemover(id));
export async function consultarHistorico(id: number, pagina: number, signal?: AbortSignal) {
 return lista(await executarHttp(() => agendamentoControllerListarHistorico(id, { pagina, limite: 10 }, { signal })), v => { const h = registro(v); return { id: numero(h.id), status: texto(h.statusNovo), data: texto(h.dataAlteracao), responsavel: texto(registro(h.usuarioResponsavel).nome), motivo: typeof h.motivo === 'string' ? h.motivo : '' }; });
}
export async function consultarHorarios(idFilial: number, idBarbeiro: number, data: string, servicoIds: number[]) {
 const o = registro(await executarHttp(() => agendamentoControllerHorarios({ idFilial, idBarbeiro, data, servicoIds })));
 if (!Array.isArray(o.horarios)) throw new Error('Horários inválidos.'); return o.horarios.map(v => texto(registro(v).inicio));
}
