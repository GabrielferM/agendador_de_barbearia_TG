import { filialControllerBuscar, filialControllerCriar, filialControllerAtualizar, filialControllerListar } from '../../../../api/filiais/filiais';
import { barbeiroControllerListar } from '../../../../api/barbeiros/barbeiros';
import type { CriarFilialDto, AtualizarFilialDto, FilialControllerListarParams, BarbeiroControllerListarParams } from '../../../../api/models';
import { executarHttp, objeto, paginaValida, type Registro } from './operacoes-api';
function filialValida(valor: unknown): Registro {
  if (!objeto(valor) || !Number.isInteger(valor.id) || typeof valor.nome !== 'string' || typeof valor.status !== 'string' || !objeto(valor.endereco) || !['cep', 'logradouro', 'numero', 'bairro', 'cidade', 'estado'].every((campo) => typeof (valor.endereco as Registro)[campo] === 'string')) throw new Error('Filial inválida.');
  return valor;
}
export async function listarFiliais(params: FilialControllerListarParams, signal?: AbortSignal) {
  return paginaValida(await executarHttp(() => filialControllerListar(params, { signal })), (item) => !!filialValida(item));
}
export const buscarFilial = async (id: number, signal?: AbortSignal) => filialValida(await executarHttp(() => filialControllerBuscar(id, { signal })));
export async function todasFiliais(signal?: AbortSignal) {
  const itens: Registro[] = []; let atual = 1; let paginas = 1;
  do { const resposta = await listarFiliais({ pagina: atual, limite: 100 }, signal); itens.push(...resposta.data); paginas = resposta.meta.totalPaginas; atual++; } while (atual <= paginas);
  return itens;
}
export async function salvarFilial(id: number | null, dados: Registro) {
  const payload: Registro = {}; const endereco: Registro = {};
  Object.entries(dados).forEach(([chave, valor]) => { if (chave.startsWith('endereco.')) endereco[chave.slice(9)] = valor; else if (chave !== 'email' || valor !== '') payload[chave] = valor; }); payload.endereco = endereco;
  return filialValida(await executarHttp(() => id === null ? filialControllerCriar(payload as unknown as CriarFilialDto) : filialControllerAtualizar(id, payload as AtualizarFilialDto), id === null ? 201 : 200));
}
export async function listarEquipe(idFilial: number, pagina: number, signal?: AbortSignal) {
  return paginaValida(await executarHttp(() => barbeiroControllerListar({ idFilial, pagina, limite: 10 } as BarbeiroControllerListarParams, { signal })), (item) => item.idFilial === idFilial && objeto(item.usuario) && typeof item.usuario.nome === 'string' && typeof item.statusProfissional === 'string');
}
