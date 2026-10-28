import { barbeiroControllerBuscar, barbeiroControllerCriar, barbeiroControllerAtualizar, barbeiroControllerRemover } from '../../../../../api/barbeiros/barbeiros';
import { filialControllerListar } from '../../../../../api/filiais/filiais';
import type { CriarBarbeiroDto, AtualizarBarbeiroDto } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';
export async function buscarBarbeiro(id: number) {
 const b = registro(await executarHttp(() => barbeiroControllerBuscar(id))), u = registro(b.usuario);
 return { nome: texto(u.nome), email: texto(u.email), idFilial: String(numero(b.idFilial)), nomeProfissional: texto(b.nomeProfissional), descricao: typeof b.descricao === 'string' ? b.descricao : '', fotoUrl: typeof b.fotoUrl === 'string' ? b.fotoUrl : '', dataAdmissao: typeof b.dataAdmissao === 'string' ? b.dataAdmissao.slice(0, 10) : '', statusProfissional: texto(b.statusProfissional) };
}
export async function listarFiliaisCadastro(signal?: AbortSignal) {
 const filiais: { valor: string; rotulo: string }[] = [];
 for (let pagina = 1; ; pagina++) {
  const r = lista(await executarHttp(() => filialControllerListar({ pagina, limite: 100 }, { signal })), valor => { const f = registro(valor); return { valor: String(numero(f.id)), rotulo: `${texto(f.nome)} (${texto(f.status)})` }; });
  filiais.push(...r.data);
  if (pagina >= r.meta.totalPaginas) return filiais;
  if (!r.data.length || r.meta.pagina !== pagina) throw new Error('Lista de filiais incompleta. Tente novamente.');
 }
}
export function salvarBarbeiro(id: number | null, dados: Record<string, string>) {
 const payload = { ...dados, statusProfissional: dados.statusProfissional || undefined, idFilial: Number(dados.idFilial), senha: dados.senha || undefined, dataAdmissao: dados.dataAdmissao || undefined };
 return id === null ? executarHttp(() => barbeiroControllerCriar(payload as unknown as CriarBarbeiroDto), 201) : executarHttp(() => barbeiroControllerAtualizar(id, payload as AtualizarBarbeiroDto));
}
export const excluirBarbeiro = (id: number) => executarHttp(() => barbeiroControllerRemover(id));
