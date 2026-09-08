import { apiBaseUrl } from '../client'
import { httpClient } from '../http-client'
import type { DashboardAdministradorResposta, DashboardBarbeiroResposta } from './models'

export class ErroDashboard extends Error {
  readonly status: number

  constructor(status: number) {
    super(status === 403 ? 'Você não possui permissão para visualizar este painel.' : 'Não foi possível carregar o painel.')
    this.name = 'ErroDashboard'
    this.status = status
  }
}

async function obter<T>(caminho: string): Promise<T> {
  const resposta = await httpClient<{ data: T; status: number }>(`${apiBaseUrl}${caminho}`, { method: 'GET' })
  if (resposta.status !== 200) throw new ErroDashboard(resposta.status)
  return resposta.data
}

export const obterDashboardAdministrador = () => obter<DashboardAdministradorResposta>('/dashboard/administrador')
export const obterDashboardBarbeiro = () => obter<DashboardBarbeiroResposta>('/dashboard/barbeiro')
