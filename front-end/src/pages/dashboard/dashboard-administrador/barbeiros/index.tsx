import {
  DashboardLayout,
  EstadoIntegracaoIndisponivel,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  CartoesBarbeiros,
  ControlesBarbeiros,
  DisponibilidadeEquipe,
  IndicadoresBarbeiros,
} from "./components/components";
import { barbeirosMock } from "./mock/dados-mock";

export function BarbeirosAdministrador() {
  const demonstracao = usarDadosMockados();
  return (
    <DashboardLayout
      titulo="Barbeiros"
      subtitulo="Gerencie a equipe e acompanhe o desempenho"
      itens={MENU_ADMINISTRADOR}
      dadosDemonstrativos={demonstracao}
    >
      {demonstracao ? (
        <>
          <ControlesBarbeiros />
          <IndicadoresBarbeiros />
          <CartoesBarbeiros barbeiros={barbeirosMock} />
          <DisponibilidadeEquipe barbeiros={barbeirosMock} />
        </>
      ) : (
        <EstadoIntegracaoIndisponivel />
      )}
    </DashboardLayout>
  );
}
