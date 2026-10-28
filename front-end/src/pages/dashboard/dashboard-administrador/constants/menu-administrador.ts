import type { ItemMenu } from '../../components/dashboard-compartilhado'

export const MENU_ADMINISTRADOR: ItemMenu[] = [
  { rotulo: 'Dashboard', permissao: 'GERENCIAR_AGENDAMENTOS', icone: 'dashboard', destino: '/admin' },
  { rotulo: 'Agendamentos', permissao: 'GERENCIAR_AGENDAMENTOS', icone: 'agenda', destino: '/admin/agendamentos' },
  { rotulo: 'Clientes', permissao: 'GERENCIAR_USUARIOS', icone: 'usuarios', destino: '/admin/clientes' },
  { rotulo: 'Barbeiros', permissao: 'GERENCIAR_USUARIOS', icone: 'usuarios', destino: '/admin/barbeiros' },
  { rotulo: 'Serviços', permissao: 'GERENCIAR_SERVICOS', icone: 'servicos', destino: '/admin/servicos' },
  { rotulo: 'Financeiro', permissao: 'GERENCIAR_COMISSOES', icone: 'financeiro', destino: '/admin/financeiro' },
]
