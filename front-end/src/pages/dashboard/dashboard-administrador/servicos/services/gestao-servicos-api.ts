import { servicoControllerBuscar, servicoControllerCriar, servicoControllerAtualizar, servicoControllerRemover } from '../../../../../api/serviços/serviços';
import { executarHttp, registro, texto, numero } from '../../services/administracao-api';
export async function buscarServico(id: number) {
 const s = registro(await executarHttp(() => servicoControllerBuscar(id)));
 if (typeof s.ativo !== 'boolean' || !Number.isFinite(Number(s.precoBase))) throw new Error('Serviço inválido.');
 return { nome: texto(s.nome), descricao: typeof s.descricao === 'string' ? s.descricao : '', precoBase: String(s.precoBase), duracaoMinutos: String(numero(s.duracaoMinutos)), ativo: String(s.ativo) };
}
export async function salvarServico(id: number | null, dados: Record<string, string>) {
 const payload = { nome: dados.nome, descricao: dados.descricao, precoBase: Number(dados.precoBase), duracaoMinutos: Number(dados.duracaoMinutos) };
 if (id === null) return executarHttp(() => servicoControllerCriar(payload), 201);
 return executarHttp(() => servicoControllerAtualizar(id, { ...payload, ativo: dados.ativo === 'true' }));
}
export const excluirServico = (id: number) => executarHttp(() => servicoControllerRemover(id));
