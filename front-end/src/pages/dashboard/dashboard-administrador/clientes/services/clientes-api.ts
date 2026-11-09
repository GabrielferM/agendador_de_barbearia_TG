import { serializarAniversario, somenteDigitos } from '../../../../../forms/campos';
import {
  clienteControllerAtualizar,
  clienteControllerBuscar,
  clienteControllerCriar,
  clienteControllerRemover,
} from '../../../../../api/clientes/clientes';
import { clienteDashboardControllerObter } from '../../../../../api/dashboard-administrativo-clientes/dashboard-administrativo-clientes';
import type { AtualizarClienteDto, CriarClienteDto } from '../../../../../api/models';
import { executarHttp, lista, registro, texto, numero } from '../../services/administracao-api';

export async function consultarClientes(
  filtros: { busca: string; status: 'ATIVO' | 'INATIVO' | 'BLOQUEADO' | undefined; pagina: number },
  signal?: AbortSignal,
) {
  const valor = registro(
    await executarHttp(() =>
      clienteDashboardControllerObter({ ...filtros, limite: 10 }, { signal }),
    ),
  );
  const indicadores = registro(valor.indicadores);
  const paginada = lista(valor, (item) => {
    const c = registro(item);
    return {
      id: numero(c.id),
      nome: texto(c.nome),
      email: texto(c.email),
      telefone: c.telefone === null ? '—' : texto(c.telefone),
      status: texto(c.status),
      ultimoAtendimento: c.ultimoAtendimento === null ? null : texto(c.ultimoAtendimento),
      proximoHorario: c.proximoHorario === null ? null : texto(c.proximoHorario),
    };
  });
  return {
    ...paginada,
    ativos: numero(indicadores.ativos),
    novosNoMes: numero(indicadores.novosNoMes),
    retornoAgendado: numero(indicadores.retornoAgendado),
  };
}
export async function buscarCliente(id: number) {
  const c = registro(await executarHttp(() => clienteControllerBuscar(id))),
    u = registro(c.usuario);
  return {
    nome: texto(u.nome),
    email: texto(u.email),
    telefone: typeof u.telefone === 'string' ? u.telefone : '',
    status: texto(u.status),
    cpf: texto(c.cpf),
    diaAniversario: typeof c.diaAniversario === 'number' ? String(c.diaAniversario) : '',
    mesAniversario: typeof c.mesAniversario === 'number' ? String(c.mesAniversario) : '',
    observacao: typeof c.observacao === 'string' ? c.observacao : '',
  };
}
export const salvarCliente = (id: number | null, dados: Record<string, string>) => {
  const payload = {
    nome: dados.nome.trim(),
    email: dados.email.trim().toLowerCase(),
    cpf: somenteDigitos(dados.cpf),
    telefone: somenteDigitos(dados.telefone ?? ''),
    observacao: (dados.observacao ?? '').trim(),
    senha: dados.senha || undefined,
    ...serializarAniversario(dados),
  };
  if (id !== null)
    return executarHttp(() =>
      clienteControllerAtualizar(id, {
        ...payload,
        status: dados.status as AtualizarClienteDto['status'],
      }),
    );
  return executarHttp(() => clienteControllerCriar(payload as CriarClienteDto), 201);
};

export const excluirCliente = (id: number) => executarHttp(() => clienteControllerRemover(id));
