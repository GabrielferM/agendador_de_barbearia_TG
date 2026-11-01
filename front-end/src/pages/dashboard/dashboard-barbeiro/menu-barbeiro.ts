import type { ItemMenu } from "../components/dashboard-compartilhado";
export const MENU_BARBEIRO: ItemMenu[] = [
  { rotulo: "Dashboard", icone: "dashboard", destino: "/barbeiro" },
  { rotulo: "Minha agenda", icone: "agenda", destino: "/barbeiro/agenda" },
  { rotulo: "Meus serviços", destino: "/barbeiro/servicos", icone: "servicos" },
  { rotulo: "Clientes", destino: "/barbeiro/clientes", icone: "usuarios" },
  { rotulo: "Histórico", destino: "/barbeiro/historico", icone: "agenda" },
];
