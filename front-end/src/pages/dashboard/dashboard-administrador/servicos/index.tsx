import {
  DashboardLayout,
  EstadoIntegracaoIndisponivel,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { CatalogoServicos, ControlesServicos, IndicadoresServicos } from "./components/components";
import { servicosMock } from "./mock/dados-mock";

export function ServicosAdministrador() {
  const demonstracao = usarDadosMockados();
  return (
    <DashboardLayout
      titulo="Serviços"
      subtitulo="Cadastre os serviços oferecidos pela barbearia"
      itens={MENU_ADMINISTRADOR}
      dadosDemonstrativos={demonstracao}
    >
      {demonstracao ? (
        <>
          <ControlesServicos />
          <IndicadoresServicos />
          <CatalogoServicos servicos={servicosMock} />
        </>
      ) : (
        <EstadoIntegracaoIndisponivel />
      )}
    </DashboardLayout>
  );
}
