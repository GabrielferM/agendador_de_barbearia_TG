import { useQuery } from "@tanstack/react-query";
import {
  ErroDashboard,
  obterDashboardAdministrador,
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
  dashboardAdministradorMock,
  usarDadosMockados,
} from "../mocks/dados-dashboard";
import { MENU_ADMINISTRADOR } from "./constants/menu-administrador";

function variacao(valor: number) {
  const prefixo = valor > 0 ? "+" : "";
  return `${prefixo}${valor}% em relação a ontem`;
}

export function DashboardAdministrador() {
  const demonstracao = usarDadosMockados();
  const consulta = useQuery({
    queryKey: ["dashboard", "administrador", demonstracao ? "mock" : "api"],
    queryFn: obterDashboardAdministrador,
    enabled: !demonstracao,
    initialData: demonstracao ? dashboardAdministradorMock : undefined,
    staleTime: 60_000,
  });
  useSessaoDashboard(consulta.error);

  return (
    <DashboardLayout
      titulo="Dashboard administrativo"
      subtitulo="Visão geral da barbearia em tempo real"
      itens={MENU_ADMINISTRADOR}
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
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Kpi
              rotulo="Agendamentos hoje"
              valor={numero.format(consulta.data.agendamentosHoje.valor)}
              detalhe={variacao(
                consulta.data.agendamentosHoje.variacaoPercentual,
              )}
              icone="agenda"
            />
            <Kpi
              rotulo="Receita de hoje"
              valor={moeda.format(consulta.data.receitaHoje.valor)}
              detalhe={variacao(consulta.data.receitaHoje.variacaoPercentual)}
              icone="financeiro"
            />
            <Kpi
              rotulo="Clientes ativos"
              valor={numero.format(consulta.data.clientesAtivos)}
              detalhe={`${consulta.data.novosClientesNoMes} novos no mês`}
              icone="usuarios"
            />
            <Kpi
              rotulo="Barbeiros ativos"
              valor={numero.format(consulta.data.barbeirosAtivos)}
              detalhe="Equipe disponível"
              icone="usuarios"
            />
            <Kpi
              rotulo="Serviços realizados"
              valor={numero.format(
                consulta.data.servicosNoMes.reduce(
                  (total, item) => total + item.quantidade,
                  0,
                ),
              )}
              detalhe="No mês atual"
              icone="servicos"
            />
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Cartao titulo="Receita dos últimos sete dias">
              <Barras
                pontos={consulta.data.receitaUltimosSeteDias}
                moedaValores
              />
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

          <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Cartao titulo="Agendamentos recentes" className="overflow-hidden">
              {consulta.data.agendamentosRecentes.length ? (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[650px] text-left text-sm">
                    <thead className="text-xs text-muted">
                      <tr>
                        <th className="pb-3 font-medium">Horário</th>
                        <th className="pb-3 font-medium">Cliente</th>
                        <th className="pb-3 font-medium">Serviço</th>
                        <th className="pb-3 font-medium">Barbeiro</th>
                        <th className="pb-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {consulta.data.agendamentosRecentes.map((item) => (
                        <tr className="border-t border-border" key={item.id}>
                          <td className="py-3">
                            {dataCurta(item.inicio)} · {hora(item.inicio)}
                          </td>
                          <td className="py-3 font-medium">{item.cliente}</td>
                          <td className="py-3 text-muted">
                            {item.servicos.join(" + ") || "Sem serviço"}
                          </td>
                          <td className="py-3">{item.barbeiro}</td>
                          <td className="py-3">
                            <span className="rounded-full bg-background px-2 py-1 text-xs">
                              {nomeStatus(item.status)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="py-12 text-center text-sm text-muted">
                  Nenhum agendamento encontrado.
                </p>
              )}
            </Cartao>
            <Cartao titulo="Desempenho dos barbeiros">
              {consulta.data.desempenhoBarbeiros.length ? (
                <ul className="space-y-4">
                  {consulta.data.desempenhoBarbeiros.map((item, indice) => {
                    const maximo =
                      consulta.data.desempenhoBarbeiros[0]?.receita || 1;
                    return (
                      <li
                        className="grid grid-cols-[auto_1fr_auto] items-center gap-3"
                        key={item.id}
                      >
                        <span className="grid size-9 place-items-center rounded-full bg-background text-sm font-bold">
                          {indice + 1}
                        </span>
                        <div className="min-w-0">
                          <div className="flex justify-between gap-2 text-sm">
                            <strong className="truncate">{item.nome}</strong>
                            <span className="text-muted">
                              {item.atendimentos} atend.
                            </span>
                          </div>
                          <div className="mt-1 h-2 overflow-hidden rounded-full bg-background">
                            <div
                              className="h-full rounded-full bg-primary"
                              style={{
                                width: `${Math.round((item.receita / maximo) * 100)}%`,
                              }}
                            />
                          </div>
                        </div>
                        <strong className="text-sm">
                          {moeda.format(item.receita)}
                        </strong>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="py-12 text-center text-sm text-muted">
                  Sem atendimentos concluídos neste mês.
                </p>
              )}
            </Cartao>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
