import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import { obterDashboardBarbeiro } from "../../../../api/dashboard/dashboard";
import {
  Cartao,
  DashboardLayout,
} from "../../components/dashboard-compartilhado";
import { MENU_BARBEIRO } from "../menu-barbeiro";
import { listarAgenda } from "../agenda/services/agenda-barbeiro-api";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { dataHorario } from "../../../agendamento/formatadores";
export function ServicosBarbeiro() {
  const { usuario } = useAutenticacao();
  const [pagina, definirPagina] = useState(1);
  const [mes] = useState(() =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" })
      .format(new Date())
      .slice(0, 7),
  );
  const fim = new Date(`${mes}-01T00:00:00-03:00`);
  fim.setUTCMonth(fim.getUTCMonth() + 1);
  fim.setTime(fim.getTime() - 1);
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA");
  const painel = useQuery({
    queryKey: ["dashboard", "barbeiro", usuario?.id],
    queryFn: obterDashboardBarbeiro,
    enabled: permitido,
    retry: false,
  });
  const consulta = useQuery({
    queryKey: ["agenda-barbeiro", usuario?.id, "servicos", mes, pagina],
    queryFn: ({ signal }) =>
      listarAgenda(
        {
          pagina,
          limite: 10,
          status: "CONCLUIDO",
          inicioDe: `${mes}-01T00:00:00-03:00`,
          inicioAte: fim.toISOString(),
        },
        signal,
      ),
    enabled: permitido,
    retry: false,
  });
  return (
    <DashboardLayout
      titulo="Serviços realizados"
      subtitulo={`Mês atual (${mes}) · ocorrências em atendimentos concluídos`}
      itens={MENU_BARBEIRO}
    >
      {!permitido ? (
        <p role="alert">
          Você não possui permissão para consultar a própria agenda.
        </p>
      ) : (
        <>
          <Cartao titulo="Serviços no mês">
            <EstadoConsulta
              carregando={painel.isPending}
              erro={painel.error}
              vazio={!painel.data?.servicosNoMes.length}
              tentar={() => void painel.refetch()}
            >
              <ul className="space-y-3">
                {painel.data?.servicosNoMes.map((item) => (
                  <li key={item.nome} className="flex justify-between gap-4">
                    <span>{item.nome}</span>
                    <strong>
                      {item.quantidade} ocorrências · {item.percentual}%
                    </strong>
                  </li>
                ))}
              </ul>
            </EstadoConsulta>
          </Cartao>
          <p className="my-4 text-sm text-muted">
            A contagem corresponde às ocorrências agregadas pelo painel.
            Quantidades por item aparecem no detalhe. Não representa habilitação
            profissional.
          </p>
          <Cartao titulo="Atendimentos concluídos do mês">
            <EstadoConsulta
              carregando={consulta.isPending}
              erro={consulta.error}
              vazio={!consulta.data?.data.length}
              tentar={() => void consulta.refetch()}
            >
              <ul className="divide-y divide-border">
                {consulta.data?.data.map((item) => (
                  <li key={item.id} className="py-3">
                    <Link
                      className="text-primary underline"
                      to={`/barbeiro/agenda/${item.id}`}
                      state={{ retorno: "/barbeiro/servicos" }}
                    >
                      {item.cliente.nome} · {dataHorario(item.inicioPrevisto)}
                    </Link>
                    <p className="text-sm">
                      {item.servicos
                        .map((s) => `${s.servico.nome} (${s.quantidade}×)`)
                        .join(", ")}
                    </p>
                  </li>
                ))}
              </ul>
            </EstadoConsulta>
          </Cartao>
          {consulta.data && (
            <nav
              aria-label="Paginação dos atendimentos"
              className="mt-4 flex justify-between"
            >
              <Button
                variant="secondary"
                isDisabled={pagina === 1}
                onPress={() => definirPagina((p) => p - 1)}
              >
                Anterior
              </Button>
              <span>
                {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)} ·{" "}
                {consulta.data.meta.total} atendimentos
              </span>
              <Button
                variant="secondary"
                isDisabled={pagina >= consulta.data.meta.totalPaginas}
                onPress={() => definirPagina((p) => p + 1)}
              >
                Próxima
              </Button>
            </nav>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
