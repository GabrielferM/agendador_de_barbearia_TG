import {
  DashboardLayout,
  EstadoIntegracaoIndisponivel,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  ControlesAgenda,
  GradeSemanal,
  ResumoAgenda,
} from "./components/components";
import { agendaSemanalMock } from "./mock/dados-mock";

export function AgendamentosAdministrador() {
  const demonstracao = usarDadosMockados();
  return (
    <DashboardLayout
      titulo="Agendamentos"
      subtitulo="Gerencie a agenda da barbearia"
      itens={MENU_ADMINISTRADOR}
      dadosDemonstrativos={demonstracao}
    >
      {demonstracao ? (
        <>
          <ControlesAgenda />
          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <GradeSemanal dias={agendaSemanalMock} />
            <ResumoAgenda dia={agendaSemanalMock[0]} />
          </div>
        </>
      ) : (
        <EstadoIntegracaoIndisponivel />
      )}
    </DashboardLayout>
  );
}
