import { financeiroDashboardControllerObter } from '../../../../../api/dashboard-administrativo-financeiro/dashboard-administrativo-financeiro';
import { comissaoControllerListar, comissaoControllerBuscar, comissaoControllerCriar, comissaoControllerAtualizar, comissaoControllerItensElegiveis } from '../../../../../api/comissões/comissões';
import type { AtualizarComissaoDto, CriarComissaoDto, ComissaoControllerListarParams } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';
export const STATUS_COMISSAO = ['PREVISTA', 'LIBERADA', 'PAGA', 'CANCELADA', 'ESTORNADA'] as const;
export const TRANSICOES_COMISSAO: Record<string, string[]> = { PREVISTA: ['LIBERADA', 'CANCELADA'], LIBERADA: ['PAGA', 'CANCELADA'], PAGA: ['ESTORNADA'], CANCELADA: [], ESTORNADA: [] };
function decimal(valor: unknown) { const s = texto(valor); if (!/^-?\d+(\.\d+)?$/.test(s) || !Number.isFinite(Number(s))) throw new Error('Valor financeiro inválido.'); return s; }
function totais(valor: unknown) { const obj = registro(valor); return Object.fromEntries(STATUS_COMISSAO.map(s => [s, numero(obj[s])])); }
export async function consultarFinanceiro(inicioDe: string, inicioAte: string, signal?: AbortSignal) {
 const o = registro(await executarHttp(() => financeiroDashboardControllerObter({ inicioDe, inicioAte }, { signal }))), i = registro(o.indicadores);
 if (!Array.isArray(o.fluxoSemanal) || !Array.isArray(o.movimentacoesRecentes) || !Array.isArray(o.comissoesPorBarbeiro)) throw new Error('Resumo financeiro inválido.');
 return { receita: numero(i.receita), variacao: numero(i.variacaoReceitaPercentual), comissoes: numero(i.comissoes), porStatus: totais(i.comissoesPorStatus), semanas: o.fluxoSemanal.map(v => { const s = registro(v); return { inicio: texto(s.inicio), receita: numero(s.receita) }; }), atendimentos: o.movimentacoesRecentes.map(v => { const a = registro(v); return { id: numero(a.id), data: texto(a.data), descricao: texto(a.descricao), valor: numero(a.valor) }; }), barbeiros: o.comissoesPorBarbeiro.map(v => { const b = registro(v); return { id: numero(b.id), nome: texto(b.barbeiro), porStatus: totais(b.porStatus) }; }) };
}
function validarComissao(valor: unknown) {
 const c = registro(valor), barbeiro = registro(c.barbeiro), item = registro(c.agendamentoServico), agendamento = registro(item.agendamento), cliente = registro(agendamento.cliente);
 const status = texto(c.status); if (!(STATUS_COMISSAO as readonly string[]).includes(status)) throw new Error('Situação de comissão inválida.');
 return { id: numero(c.id), idBarbeiro: numero(c.idBarbeiro), idItem: numero(c.idAgendamentoServico), barbeiro: texto(barbeiro.nomeProfissional) || texto(registro(barbeiro.usuario).nome), cliente: texto(registro(cliente.usuario).nome), servico: texto(registro(item.servico).nome), inicio: texto(agendamento.inicioPrevisto), base: decimal(c.baseCalculo), percentual: decimal(c.percentualAplicado), valor: decimal(c.valorComissao), status, dataGeracao: texto(c.dataGeracao), dataLiberacao: c.dataLiberacao === null ? null : texto(c.dataLiberacao), dataPagamento: c.dataPagamento === null ? null : texto(c.dataPagamento), dataEstorno: c.dataEstorno === null ? null : texto(c.dataEstorno), motivoEstorno: typeof c.motivoEstorno === 'string' ? c.motivoEstorno : '', observacao: typeof c.observacao === 'string' ? c.observacao : '' };
}
export type ComissaoAdministrativa = ReturnType<typeof validarComissao>;
export async function consultarComissoes(filtros: ComissaoControllerListarParams, signal?: AbortSignal) { return lista(await executarHttp(() => comissaoControllerListar(filtros, { signal })), validarComissao); }
export async function buscarComissao(id: number) { return validarComissao(await executarHttp(() => comissaoControllerBuscar(id))); }
export async function itensElegiveis(busca: string, pagina: number, signal?: AbortSignal) {
 return lista(await executarHttp(() => comissaoControllerItensElegiveis({ busca, pagina, limite: 10 }, { signal })), v => { const i = registro(v); return { id: numero(i.id), idBarbeiro: numero(i.idBarbeiro), cliente: texto(i.cliente), barbeiro: texto(i.barbeiro), servico: texto(i.servico), inicio: texto(i.inicioPrevisto), subtotal: decimal(i.subtotal) }; });
}
export const criarComissao = (dados: CriarComissaoDto) => executarHttp(() => comissaoControllerCriar(dados), 201);
export const editarComissao = (id: number, dados: AtualizarComissaoDto) => executarHttp(() => comissaoControllerAtualizar(id, dados));
