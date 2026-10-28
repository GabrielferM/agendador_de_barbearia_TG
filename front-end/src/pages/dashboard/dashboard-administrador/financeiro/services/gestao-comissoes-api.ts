import { comissaoControllerBuscar, comissaoControllerCriar, comissaoControllerAtualizar, comissaoControllerListar } from '../../../../../api/comissões/comissões';
import { agendamentoControllerListar } from '../../../../../api/agendamentos/agendamentos';
import { barbeiroControllerListar } from '../../../../../api/barbeiros/barbeiros';
import type { AtualizarComissaoDto, ComissaoControllerListarParams } from '../../../../../api/models';
import { executarHttp, registro, texto, numero, lista } from '../../services/administracao-api';
const decimal = (v: unknown) => { if (typeof v !== 'string' && typeof v !== 'number' || !Number.isFinite(Number(v))) throw new Error('Valor financeiro inválido.'); return String(v); };
function comissao(valor: unknown) {
 const c = registro(valor), item = registro(c.agendamentoServico), barbeiro = registro(c.barbeiro);
 return { id: numero(c.id), barbeiro: texto(registro(barbeiro.usuario).nome), servico: texto(registro(item.servico).nome), status: texto(c.status), baseCalculo: decimal(c.baseCalculo), percentualAplicado: decimal(c.percentualAplicado), valorComissao: decimal(c.valorComissao), dataGeracao: texto(c.dataGeracao), observacao: typeof c.observacao === 'string' ? c.observacao : '', motivoEstorno: typeof c.motivoEstorno === 'string' ? c.motivoEstorno : '', dataLiberacao: typeof c.dataLiberacao === 'string' ? c.dataLiberacao : '', dataPagamento: typeof c.dataPagamento === 'string' ? c.dataPagamento : '', dataEstorno: typeof c.dataEstorno === 'string' ? c.dataEstorno : '' };
}
export const consultarComissoes = async (pagina: number, status: string, idBarbeiro: string, signal?: AbortSignal) => lista(await executarHttp(() => comissaoControllerListar({ pagina, limite: 10, status: status ? status as ComissaoControllerListarParams['status'] : undefined, idBarbeiro: idBarbeiro ? Number(idBarbeiro) : undefined }, { signal })), comissao);
export const detalheComissao = async (id: number) => comissao(await executarHttp(() => comissaoControllerBuscar(id)));
export async function profissionaisComissao(signal?: AbortSignal) {
 const opcoes: { valor: string; rotulo: string }[] = [];
 for (let pagina = 1; ; pagina++) {
  const r = lista(await executarHttp(() => barbeiroControllerListar({ pagina, limite: 100 }, { signal })), item => { const b = registro(item); return { valor: String(numero(b.id)), rotulo: texto(b.nomeProfissional) }; });
  opcoes.push(...r.data); if (pagina >= r.meta.totalPaginas) return opcoes;
  if (!r.data.length || r.meta.pagina !== pagina) throw new Error('Lista incompleta de profissionais.');
 }
}
export async function itensElegiveis(pagina: number, signal?: AbortSignal) {
 const r = lista(await executarHttp(() => agendamentoControllerListar({ pagina, limite: 10, status: 'CONCLUIDO' }, { signal })), registro);
 return { meta: r.meta, data: r.data.flatMap(a => {
  if (!Array.isArray(a.servicos)) throw new Error('Atendimento inválido.');
  return a.servicos.filter(i => !registro(i).comissao).map(i => { const item = registro(i); return { valor: String(numero(item.id)), idBarbeiro: numero(a.idBarbeiro), rotulo: `${texto(registro(registro(a.cliente).usuario).nome)} · ${texto(registro(a.barbeiro).nomeProfissional)} · ${texto(registro(item.servico).nome)} · R$ ${decimal(item.subtotal)} · ${new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short' }).format(new Date(texto(a.inicioPrevisto)))}` }; });
 }) };
}
export function salvarComissao(id: number | null, dados: Record<string, string>, elegiveis: { valor: string; idBarbeiro: number }[]) {
 if (id === null) {
  const item = elegiveis.find(i => i.valor === dados.idAgendamentoServico); if (!item) return Promise.reject(new Error('Selecione um item elegível.'));
  return executarHttp(() => comissaoControllerCriar({ idAgendamentoServico: Number(item.valor), idBarbeiro: item.idBarbeiro, percentualAplicado: Number(dados.percentualAplicado), observacao: dados.observacao }), 201);
 }
 const status = dados.status as AtualizarComissaoDto['status'];
 return executarHttp(() => comissaoControllerAtualizar(id, { status, observacao: dados.observacao, ...(status === 'ESTORNADA' && dados.statusOriginal !== 'ESTORNADA' ? { motivoEstorno: dados.motivoEstorno } : {}) }));
}
