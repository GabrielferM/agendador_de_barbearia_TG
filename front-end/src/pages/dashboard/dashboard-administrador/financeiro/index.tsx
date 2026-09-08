import {
  DashboardLayout,
  EstadoIntegracaoIndisponivel,
} from "../../components/dashboard-compartilhado";
import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  ControlesFinanceiros,
  FluxoFinanceiro,
  FormasPagamento,
  IndicadoresFinanceiros,
  TabelaComissoes,
  TabelaMovimentacoes,
} from "./components/components";
import {
  comissoesMock,
  fluxoFinanceiroMock,
  formasPagamentoMock,
  movimentacoesMock,
} from "./dados-mock";

export function FinanceiroAdministrador() {
  const demonstracao = usarDadosMockados();
  return (
    <DashboardLayout
      titulo="Financeiro"
      subtitulo="Acompanhe receitas, despesas e comissões"
      itens={MENU_ADMINISTRADOR}
      dadosDemonstrativos={demonstracao}
    >
      {demonstracao ? (
        <>
          <ControlesFinanceiros />
          <IndicadoresFinanceiros />
          <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <FluxoFinanceiro semanas={fluxoFinanceiroMock} />
            <FormasPagamento formas={formasPagamentoMock} />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
            <TabelaMovimentacoes itens={movimentacoesMock} />
            <TabelaComissoes itens={comissoesMock} />
          </div>
        </>
      ) : (
        <EstadoIntegracaoIndisponivel />
      )}
    </DashboardLayout>
  );
}
