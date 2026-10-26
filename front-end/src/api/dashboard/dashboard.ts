import { executarHttp, ErroOperacao } from '../operacao-http';
import { validarDashboardAdministrador } from './validar-dashboard-administrador';
import { apiBaseUrl } from '../client'
import { httpClient } from '../http-client'
import type { DashboardAdministradorResposta, DashboardBarbeiroResposta } from './models'

export class ErroDashboard extends Error {
  readonly status: number

  constructor(status: number) {
    super(status === 403 ? 'Você não possui permissão para visualizar este painel.' : status === 429 ? 'Muitas consultas. Aguarde antes de tentar novamente.' : 'Não foi possível carregar o painel.')
    this.name = 'ErroDashboard'
    this.status = status
  }
}

async function obter<T>(caminho: string, signal?: AbortSignal): Promise<T> {
  try {
    return await executarHttp(() => httpClient<{ data: unknown; status: number; headers: Headers }>(`${apiBaseUrl}${caminho}`, { method: 'GET', signal })) as T;
  } catch (erro) {
    if (erro instanceof ErroOperacao) throw new ErroDashboard(erro.status);
    throw erro;
  }
}

export const obterDashboardAdministrador = async (signal?: AbortSignal): Promise<DashboardAdministradorResposta> => validarDashboardAdministrador(await obter<unknown>('/dashboard/administrador', signal))
export const obterDashboardBarbeiro = () => obter<DashboardBarbeiroResposta>('/dashboard/barbeiro')
