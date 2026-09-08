import { useQuery } from "@tanstack/react-query";
import {
  ErroDashboard,
  obterDashboardBarbeiro,
} from "../../../api/dashboard/dashboard";
import {
  Barras,
  Cartao,
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
  Kpi,
} from "../components/dashboard-compartilhado";
import {
  dataCurta,
  hora,
  moeda,
  nomeStatus,
  numero,
} from "../components/dashboard-formatadores";
import { useSessaoDashboard } from "../components/use-sessao-dashboard";
import {
  dashboardBarbeiroMock,
  usarDadosMockados,
} from "../mocks/dados-dashboard";

const MENU = [
  { rotulo: "Dashboard", icone: "dashboard", ativo: true },
  { rotulo: "Minha agenda", icone: "agenda" },
  { rotulo: "Meus serviços", icone: "servicos" },
  { rotulo: "Clientes", icone: "usuarios" },
  { rotulo: "Histórico", icone: "agenda" },
];

function variacao(valor: number, periodo = "ontem") {
  const prefixo = valor > 0 ? "+" : "";
  return `${prefixo}${valor}% em relação a ${periodo}`;
}

export function DashboardBarbeiro() {
  const demonstracao = usarDadosMockados();
  const consulta = useQuery({
    queryKey: ["dashboard", "barbeiro", demonstracao ? "mock" : "api"],
    queryFn: obterDashboardBarbeiro,
    enabled: !demonstracao,
    initialData: demonstracao ? dashboardBarbeiroMock : undefined,
    staleTime: 60_000,
  });
  useSessaoDashboard(consulta.error);

  return (
    <DashboardLayout
      titulo="Olá! 👋"
      subtitulo="Tenha um ótimo dia e bons cortes"
      itens={MENU}
      dadosDemonstrativos={demonstracao}
    >
      {consulta.isPending ? (
        <EstadoCarregamento />
      ) : consulta.isError ? (
        <EstadoErro
          mensagem={
            consulta.error instanceof ErroDashboard
              ? consulta.error.message
              : "Não foi possível carregar o painel."
          }
          tentarNovamente={() => void consulta.refetch()}
        />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Kpi
              rotulo="Atendimentos hoje"
              valor={numero.format(consulta.data.atendimentosHoje.valor)}
              detalhe={variacao(
                consulta.data.atendimentosHoje.variacaoPercentual,
              )}
              icone="servicos"
            />
            <Kpi
              rotulo="Faturamento hoje"
              valor={moeda.format(consulta.data.receitaHoje.valor)}
              detalhe={variacao(consulta.data.receitaHoje.variacaoPercentual)}
              icone="financeiro"
            />
            <Kpi
              rotulo="Clientes na semana"
              valor={numero.format(consulta.data.clientesNaSemana.valor)}
              detalhe={variacao(
                consulta.data.clientesNaSemana.variacaoPercentual,
                "semana anterior",
              )}
              icone="usuarios"
            />
            <Kpi
              rotulo="Serviços no mês"
              valor={numero.format(
                consulta.data.servicosNoMes.reduce(
                  (total, item) => total + item.quantidade,
                  0,
                ),
              )}
              detalhe="Atendimentos concluídos"
              icone="agenda"
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Cartao titulo="Minha agenda de hoje">
              {consulta.data.agendaHoje.length ? (
                <ul className="divide-y divide-border">
                  {consulta.data.agendaHoje.map((item) => (
                    <li
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-3 text-sm"
                      key={item.id}
                    >
                      <strong>{hora(item.inicio)}</strong>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.cliente}</p>
                        <p className="truncate text-xs text-muted">
                          {item.servicos.join(" + ") || "Sem serviço"}
                        </p>
                      </div>
                      <span className="rounded-full bg-background px-2 py-1 text-xs">
                        {nomeStatus(item.status)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-12 text-center text-sm text-muted">
                  Nenhum atendimento agendado para hoje.
                </p>
              )}
            </Cartao>
            <Cartao titulo="Próximos agendamentos">
              {consulta.data.proximosAgendamentos.length ? (
                <ul className="divide-y divide-border">
                  {consulta.data.proximosAgendamentos.map((item) => (
                    <li
                      className="grid grid-cols-[1fr_auto] gap-3 py-3 text-sm"
                      key={item.id}
                    >
                      <div>
                        <p className="font-medium">{item.cliente}</p>
                        <p className="text-xs text-muted">
                          {item.servicos.join(" + ") || "Sem serviço"}
                        </p>
                      </div>
                      <div className="text-right">
                        <strong>{hora(item.inicio)}</strong>
                        <p className="text-xs text-muted">
                          {dataCurta(item.inicio)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-12 text-center text-sm text-muted">
                  Nenhum próximo agendamento.
                </p>
              )}
            </Cartao>
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Cartao titulo="Atendimentos nos últimos sete dias">
              <Barras pontos={consulta.data.atendimentosUltimosSeteDias} />
            </Cartao>
            <Cartao titulo="Serviços mais realizados">
              {consulta.data.servicosNoMes.length ? (
                <ul className="space-y-4">
                  {consulta.data.servicosNoMes.slice(0, 5).map((item) => (
                    <li key={item.nome}>
                      <div className="mb-1 flex justify-between gap-3 text-sm">
                        <span>{item.nome}</span>
                        <strong>
                          {item.quantidade}{" "}
                          <span className="font-normal text-muted">
                            ({item.percentual}%)
                          </span>
                        </strong>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${item.percentual}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-12 text-center text-sm text-muted">
                  Nenhum serviço concluído neste mês.
                </p>
              )}
            </Cartao>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
