import type { ItemMenu } from '../components/dashboard-compartilhado';
export const MENU_BARBEIRO: ItemMenu[] = [
  { rotulo: 'Dashboard', icone: 'dashboard', destino: '/barbeiro' },
  { rotulo: 'Minha agenda', icone: 'agenda', destino: '/barbeiro/agenda' },
  { rotulo: 'Meus serviços', icone: 'servicos' },
  { rotulo: 'Clientes', icone: 'usuarios' },
  { rotulo: 'Histórico', icone: 'agenda', destino: '/barbeiro/historico' },
];
