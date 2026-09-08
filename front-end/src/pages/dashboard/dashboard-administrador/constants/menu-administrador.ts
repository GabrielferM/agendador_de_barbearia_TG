import type { ItemMenu } from '../../components/dashboard-compartilhado'

export const MENU_ADMINISTRADOR: ItemMenu[] = [
  { rotulo: 'Dashboard', icone: 'dashboard', destino: '/admin' },
  { rotulo: 'Agendamentos', icone: 'agenda', destino: '/admin/agendamentos' },
  { rotulo: 'Clientes', icone: 'usuarios', destino: '/admin/clientes' },
  { rotulo: 'Barbeiros', icone: 'usuarios', destino: '/admin/barbeiros' },
  { rotulo: 'Serviços', icone: 'servicos', destino: '/admin/servicos' },
  { rotulo: 'Financeiro', icone: 'financeiro', destino: '/admin/financeiro' },
]
