import {
  dataCurtaBarbeiro as dataCurta,
  horaBarbeiro as hora,
} from "./periodo-barbeiro";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import { Link } from "react-router-dom";
import { MENU_BARBEIRO } from "./menu-barbeiro";
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
  moeda,
  nomeStatus,
  numero,
} from "../components/dashboard-formatadores";
import { useSessaoDashboard } from "../components/use-sessao-dashboard";

function variacao(valor: number | null, periodo = "ontem") {
  if (valor === null) return "Sem base de comparação no período anterior";
  const prefixo = valor > 0 ? "+" : "";
  return `${prefixo}${valor}% em relação a ${periodo}`;
}

export function DashboardBarbeiro() {
  const { usuario } = useAutenticacao();
  const consulta = useQuery({
    queryKey: ["dashboard", "barbeiro", usuario?.id],
    queryFn: ({ signal }) => obterDashboardBarbeiro(signal),
    enabled: !!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA"),
    retry: false,
    staleTime: 60_000,
  });
  useSessaoDashboard(consulta.error);

  return (
    <DashboardLayout
      fusoHorario="America/Sao_Paulo"
      titulo="Olá!"
      subtitulo="Tenha um ótimo dia e bons cortes"
      itens={MENU_BARBEIRO}
    >
      {!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA") ? (
        <p role="alert">
          Você não possui permissão para consultar a própria agenda.
        </p>
      ) : consulta.isPending ? (
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
              rotulo="Agendamentos hoje"
              valor={numero.format(consulta.data.atendimentosHoje.valor)}
              detalhe={`Cancelados excluídos · ${variacao(consulta.data.atendimentosHoje.variacaoPercentual)}`}
              icone="servicos"
            />
            <Kpi
              rotulo="Receita de serviços concluídos hoje"
              valor={moeda.format(consulta.data.receitaHoje.valor)}
              detalhe={variacao(consulta.data.receitaHoje.variacaoPercentual)}
              icone="financeiro"
            />
            <Kpi
              rotulo="Clientes nos últimos 7 dias"
              valor={numero.format(consulta.data.clientesNaSemana.valor)}
              detalhe={variacao(
                consulta.data.clientesNaSemana.variacaoPercentual,
                "sete dias anteriores",
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
              detalhe="Unidades de serviços em atendimentos concluídos"
              icone="agenda"
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Cartao titulo="Minha agenda de hoje">
              <Link
                to="/barbeiro/agenda"
                className="mb-2 inline-block text-sm text-primary underline"
              >
                Ver agenda completa
              </Link>
              {consulta.data.agendaHoje.length ? (
                <ul className="divide-y divide-border">
                  {consulta.data.agendaHoje.map((item) => (
                    <li
                      className="grid grid-cols-[64px_1fr_auto] items-center gap-3 py-3 text-sm"
                      key={item.id}
                    >
                      <Link
                        className="underline"
                        to={`/barbeiro/agenda/${item.id}`}
                      >
                        <strong>{hora(item.inicio)}</strong>
                      </Link>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.cliente}</p>
                        <p className="truncate text-xs text-muted">
                          {item.servicos.join(" + ") || "Sem serviço"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
                        <span className="rounded-full bg-background px-2 py-1 text-xs">
                          {nomeStatus(item.status)}
                        </span>
                        <Link
                          className="text-xs text-primary underline"
                          to={`/barbeiro/agenda/${item.id}`}
                        >
                          Visualizar
                        </Link>
                      </div>
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
                        <Link
                          className="underline"
                          to={`/barbeiro/agenda/${item.id}`}
                        >
                          <strong>{hora(item.inicio)}</strong>
                        </Link>
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

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
            <Cartao titulo="Atendimentos nos últimos sete dias">
              <Barras
                formatarData={dataCurta}
                pontos={consulta.data.atendimentosUltimosSeteDias}
              />
            </Cartao>
            <Cartao titulo="Serviços mais realizados">
              <Link
                to="/barbeiro/historico"
                className="mb-3 inline-block text-sm text-primary underline"
              >
                Histórico de atendimentos
              </Link>
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
