import { ComissoesPainel } from "../../financeiro/comissoes-painel";
import { periodoFinanceiroAtual } from "../../financeiro/financeiro-api";
import { TaxasComissao } from "../../financeiro/taxas-comissao";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { estiloBotao, estiloCampo } from "../components/formulario-cadastro";
import { ControlesPeriodo } from "./components/controles-periodo";
import {
  FluxoFinanceiro,
  IndicadoresFinanceiros,
  TabelaComissoes,
  TabelaMovimentacoes,
} from "./components/components";
import { consultarFinanceiro } from "./services/financeiro-api";

export function FinanceiroAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido =
    usuario?.papel === "ADMINISTRADOR" &&
    usuario.permissoes.includes("GERENCIAR_COMISSOES");
  const [periodo, setPeriodo] = useState(periodoFinanceiroAtual);
  const consulta = useQuery({
    queryKey: ["admin", usuario?.id, "financeiro", periodo],
    enabled: permitido,
    queryFn: ({ signal }) =>
      consultarFinanceiro(periodo.inicioDe, periodo.inicioAte, signal),
    staleTime: 60_000,
  });
  return (
    <DashboardLayout
      titulo="Financeiro"
      subtitulo="Acompanhe serviços concluídos e comissões registradas"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">
          Você não possui permissão para consultar o financeiro.
        </p>
      ) : (
        <>
          <ControlesPeriodo
            inicial={periodo}
            aplicar={setPeriodo}
            estiloCampo={estiloCampo}
            estiloBotao={estiloBotao}
          />
          <ComissoesPainel admin periodo={periodo} />
          <TaxasComissao />
          {consulta.isPending ? (
            <EstadoCarregamento />
          ) : consulta.isError ? (
            <EstadoErro
              mensagem={consulta.error.message}
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : (
            <>
              <IndicadoresFinanceiros dados={consulta.data.indicadores} />
              <FluxoFinanceiro semanas={consulta.data.fluxoSemanal} />
              <div className="mt-4">
                <TabelaMovimentacoes
                  itens={consulta.data.movimentacoesRecentes}
                />
              </div>
              <div className="mt-4">
                <TabelaComissoes itens={consulta.data.comissoesPorBarbeiro} />
              </div>
              <p className="mt-4 text-sm text-muted">
                Receita calculada pelos serviços concluídos; não representa
                confirmação de pagamento. Despesas, lucro líquido e formas de
                pagamento ainda não são registrados no sistema.
              </p>
            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
