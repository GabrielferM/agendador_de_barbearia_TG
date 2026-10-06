import { FinanceiroIntegrado } from "./financeiro-integrado";
import {
  DashboardLayout,
  Cartao,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
export function FinanceiroAdministrador() {
  if (usarDadosMockados())
    return (
      <DashboardLayout
        titulo="Financeiro"
        subtitulo="Exemplo de consulta financeira"
        itens={MENU_ADMINISTRADOR}
        dadosDemonstrativos
      >
        <Cartao titulo="Fluxo financeiro">
          <p>
            Receitas calculadas e comissões cadastradas estão disponíveis no
            modo integrado. Não existem controles de despesas ou pagamentos
            neste fluxo.
          </p>
        </Cartao>
      </DashboardLayout>
    );
  return <FinanceiroIntegrado />;
}
