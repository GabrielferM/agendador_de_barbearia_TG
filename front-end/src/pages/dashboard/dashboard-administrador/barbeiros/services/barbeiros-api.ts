import { barbeiroControllerAtualizar, barbeiroControllerBuscar, barbeiroControllerCriar, barbeiroControllerRemover } from '../../../../../api/barbeiros/barbeiros';
import { barbeiroDashboardControllerObter } from '../../../../../api/dashboard-administrativo-barbeiros/dashboard-administrativo-barbeiros';
import { catalogoPublicoControllerFiliais } from '../../../../../api/catálogo-público/catálogo-público';
import type { AtualizarBarbeiroDto, CriarBarbeiroDto } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';
export async function consultarBarbeiros(filtros: { busca: string; status?: 'ATIVO' | 'INATIVO' | 'AFASTADO'; pagina: number }, signal?: AbortSignal) {
 const obj = registro(await executarHttp(() => barbeiroDashboardControllerObter({ ...filtros, limite: 10 }, { signal }))), indicadores = registro(obj.indicadores);
 return { ...lista(obj, item => { const b = registro(item); return { id: numero(b.id), nome: texto(b.nome), filial: texto(b.filial), status: texto(b.status), atendimentosHoje: numero(b.atendimentosHoje), receitaMes: numero(b.receitaMes), comissoesAPagar: numero(b.comissoesAPagar) }; }), ativos: numero(indicadores.ativos), atendimentosMes: numero(indicadores.atendimentosMes), comissoesAPagar: numero(indicadores.comissoesAPagar) };
}
export async function consultarFiliais(signal?: AbortSignal) {
 const resultado: { valor: string; rotulo: string }[] = [];
 for (let pagina = 1;; pagina++) {
  const resposta = lista(await executarHttp(() => catalogoPublicoControllerFiliais({ pagina, limite: 100 }, { signal })), item => { const f = registro(item); return { valor: String(numero(f.id)), rotulo: texto(f.nome) }; });
  resultado.push(...resposta.data); if (pagina >= resposta.meta.totalPaginas) return resultado;
 }
}
export async function buscarBarbeiro(id: number) {
 const b = registro(await executarHttp(() => barbeiroControllerBuscar(id))), u = registro(b.usuario);
 return { nome: texto(u.nome), email: texto(u.email), idFilial: String(numero(b.idFilial)), nomeProfissional: texto(b.nomeProfissional), descricao: typeof b.descricao === 'string' ? b.descricao : '', fotoUrl: typeof b.fotoUrl === 'string' ? b.fotoUrl : '', dataAdmissao: typeof b.dataAdmissao === 'string' ? b.dataAdmissao.slice(0, 10) : '', statusProfissional: texto(b.statusProfissional) };
}
export function salvarBarbeiro(id: number | null, dados: Record<string, string>) {
 const payload = { ...dados, idFilial: Number(dados.idFilial), senha: dados.senha || undefined, dataAdmissao: dados.dataAdmissao || undefined };
 return id === null ? executarHttp(() => barbeiroControllerCriar(payload as unknown as CriarBarbeiroDto), 201) : executarHttp(() => barbeiroControllerAtualizar(id, payload as AtualizarBarbeiroDto));
}
export const excluirBarbeiro = (id: number) => executarHttp(() => barbeiroControllerRemover(id));
