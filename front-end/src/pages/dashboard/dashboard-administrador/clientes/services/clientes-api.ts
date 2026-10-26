import { clienteControllerAtualizar, clienteControllerBuscar, clienteControllerCriar, clienteControllerRemover } from '../../../../../api/clientes/clientes';
import { clienteDashboardControllerObter } from '../../../../../api/dashboard-administrativo-clientes/dashboard-administrativo-clientes';
import type { AtualizarClienteDto, CriarClienteDto } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';

export async function consultarClientes(filtros: { busca: string; status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | undefined; pagina: number }, signal?: AbortSignal) {
  const valor = registro(await executarHttp(() => clienteDashboardControllerObter({ ...filtros, limite: 10 }, { signal })));
  const indicadores = registro(valor.indicadores);
  const paginada = lista(valor, item => { const c = registro(item); return { id: numero(c.id), nome: texto(c.nome), email: texto(c.email), telefone: c.telefone === null ? '—' : texto(c.telefone), status: texto(c.status), ultimoAtendimento: c.ultimoAtendimento === null ? null : texto(c.ultimoAtendimento), proximoHorario: c.proximoHorario === null ? null : texto(c.proximoHorario) }; });
  return { ...paginada, ativos: numero(indicadores.ativos), novosNoMes: numero(indicadores.novosNoMes), retornoAgendado: numero(indicadores.retornoAgendado) };
}
export async function buscarCliente(id: number) {
  const c = registro(await executarHttp(() => clienteControllerBuscar(id))), u = registro(c.usuario);
  return { nome: texto(u.nome), email: texto(u.email), telefone: typeof u.telefone === 'string' ? u.telefone : '', status: texto(u.status), cpf: texto(c.cpf), dataNascimento: typeof c.dataNascimento === 'string' ? c.dataNascimento.slice(0, 10) : '', observacao: typeof c.observacao === 'string' ? c.observacao : '' };
}
export const salvarCliente = (id: number | null, dados: Record<string, string>) => {
  const payload = { ...dados, senha: dados.senha || undefined, dataNascimento: dados.dataNascimento || undefined };
  if (id !== null) return executarHttp(() => clienteControllerAtualizar(id, payload as AtualizarClienteDto));
  const { status: _status, ...criacao } = payload as typeof payload & { status?: string };
  void _status;
  return executarHttp(() => clienteControllerCriar(criacao as unknown as CriarClienteDto), 201);
};
export const excluirCliente = (id: number) => executarHttp(() => clienteControllerRemover(id));
