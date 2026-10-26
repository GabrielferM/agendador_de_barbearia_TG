import { servicoControllerAtualizar, servicoControllerBuscar, servicoControllerCriar, servicoControllerRemover } from '../../../../../api/serviços/serviços';
import { servicosDashboardControllerObter } from '../../../../../api/dashboard-administrativo-serviços/dashboard-administrativo-serviços';
import type { AtualizarServicoDto, CriarServicoDto } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';
export async function consultarServicos(filtros: { busca: string; ativo?: 'true' | 'false'; pagina: number }, signal?: AbortSignal) {
 const obj = registro(await executarHttp(() => servicosDashboardControllerObter({ ...filtros, limite: 10 }, { signal }))), indicadores = registro(obj.indicadores);
 return { ...lista(obj, item => { const s = registro(item); if (typeof s.ativo !== 'boolean') throw new Error('Status de serviço inválido.'); return { id: numero(s.id), nome: texto(s.nome), ativo: s.ativo, preco: numero(s.preco), duracaoMinutos: numero(s.duracaoMinutos), realizadosMes: numero(s.realizadosMes), receitaMes: numero(s.receitaMes) }; }), ativos: numero(indicadores.ativos), maisRealizado: indicadores.maisRealizado === null ? '—' : texto(indicadores.maisRealizado), ticketMedio: numero(indicadores.ticketMedio) };
}
export async function buscarServico(id: number) {
 const s = registro(await executarHttp(() => servicoControllerBuscar(id)));
 if (typeof s.ativo !== 'boolean' || !Number.isFinite(Number(s.precoBase))) throw new Error('Serviço inválido.');
 return { nome: texto(s.nome), descricao: typeof s.descricao === 'string' ? s.descricao : '', precoBase: String(s.precoBase), duracaoMinutos: String(numero(s.duracaoMinutos)), ativo: String(s.ativo) };
}
export function salvarServico(id: number | null, dados: Record<string, string>) {
 const payload = { nome: dados.nome, descricao: dados.descricao, precoBase: Number(dados.precoBase), duracaoMinutos: Number(dados.duracaoMinutos) };
 return id === null ? executarHttp(() => servicoControllerCriar(payload as CriarServicoDto), 201) : executarHttp(() => servicoControllerAtualizar(id, { ...payload, ativo: dados.ativo === 'true' } as AtualizarServicoDto));
}
export const excluirServico = (id: number) => executarHttp(() => servicoControllerRemover(id));
