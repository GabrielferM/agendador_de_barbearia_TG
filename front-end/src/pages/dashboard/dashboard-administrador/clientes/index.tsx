import {
  DashboardLayout,
  EstadoIntegracaoIndisponivel,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  ControlesClientes,
  IndicadoresClientes,
  TabelaClientes,
} from "./components/components";
import { clientesMock } from "./mock/dados-mock";

export function ClientesAdministrador() {
  const demonstracao = usarDadosMockados();
  return (
    <DashboardLayout
      titulo="Clientes"
      subtitulo="Consulte e gerencie os clientes cadastrados"
      itens={MENU_ADMINISTRADOR}
      dadosDemonstrativos={demonstracao}
    >
      {demonstracao ? (
        <>
          <ControlesClientes />
          <IndicadoresClientes />
          <TabelaClientes clientes={clientesMock} />
        </>
      ) : (
        <EstadoIntegracaoIndisponivel />
      )}
    </DashboardLayout>
  );
}
