import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import type { AgendamentoControllerListarParams } from "../../../../api/models";
import {
  DashboardLayout,
  Cartao,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { nomeStatus } from "../../components/dashboard-formatadores";
import { dataHorario } from "../../../agendamento/formatadores";
import {
  validarFiltros,
  campoBarbeiro as campo,
  hojeBrasilia,
  STATUS_AGENDA,
} from "../periodo-barbeiro";
import { MENU_BARBEIRO } from "../menu-barbeiro";
import { listarAgenda } from "./services/agenda-barbeiro-api";

export function AgendaBarbeiro() {
  const { usuario } = useAutenticacao();
  const [params, definirParams] = useSearchParams();
  const { pagina, de, ate, status, erro } = validarFiltros(params);
  const filtros: AgendamentoControllerListarParams = {
    pagina,
    limite: 10,
    inicioDe: `${de}T00:00:00-03:00`,
    inicioAte: `${ate}T23:59:59.999-03:00`,
    status: STATUS_AGENDA.find((item) => item === status),
  };
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA");
  const consulta = useQuery({
    queryKey: ["agenda-barbeiro", usuario?.id, filtros],
    queryFn: ({ signal }) => listarAgenda(filtros, signal),
    enabled: permitido && !erro,
    retry: false,
  });
  return (
    <DashboardLayout
      fusoHorario="America/Sao_Paulo"
      titulo="Minha agenda"
      subtitulo="Horários no fuso de Brasília"
      itens={MENU_BARBEIRO}
    >
      {!permitido ? (
        <p role="alert">
          Você não possui permissão para consultar a própria agenda.
        </p>
      ) : (
        <Cartao>
          <form
            key={`${de}-${ate}-${status}`}
            onSubmit={(e) => {
              e.preventDefault();
              const dados = new FormData(e.currentTarget);
              definirParams({
                de: String(dados.get("de")),
                ate: String(dados.get("ate")),
                status: String(dados.get("status")),
                pagina: "1",
              });
            }}
            className="mb-4 grid items-end gap-3 border-b border-border pb-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1.2fr_auto_auto]"
          >
            <label>
              De
              <input
                name="de"
                type="date"
                required
                defaultValue={de}
                className={campo}
              />
            </label>
            <label>
              Até
              <input
                name="ate"
                type="date"
                required
                min={de}
                defaultValue={ate}
                className={campo}
              />
            </label>
            <label>
              Situação
              <select name="status" defaultValue={status} className={campo}>
                <option value="">Todas</option>
                {STATUS_AGENDA.map((s) => (
                  <option key={s} value={s}>
                    {nomeStatus(s)}
                  </option>
                ))}
              </select>
            </label>
            <Button type="submit">Aplicar filtros</Button>
            <Button
              variant="secondary"
              onPress={() =>
                definirParams({ de: hojeBrasilia(), ate: hojeBrasilia() })
              }
            >
              Hoje
            </Button>
          </form>
          {erro ? (
            <p role="alert" className="py-8 text-danger">
              {erro}
            </p>
          ) : consulta.isPending ? (
            <EstadoCarregamento />
          ) : consulta.isError ? (
            <EstadoErro
              mensagem={
                consulta.error instanceof Error
                  ? consulta.error.message
                  : "Não foi possível carregar a agenda."
              }
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : !consulta.data?.data.length ? (
            <div role="status" className="py-12 text-center">
              <p className="font-semibold">Nenhum agendamento neste período.</p>
              <p className="mt-1 text-sm text-muted">
                Altere os filtros ou consulte outra data.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {consulta.data?.data.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-border py-3 last:border-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="font-semibold">{item.cliente.nome}</h2>
                      <p>{dataHorario(item.inicioPrevisto)}</p>
                      <p>
                        <span className="rounded-full bg-background px-2 py-1 text-xs">
                          {nomeStatus(item.status)}
                        </span>
                      </p>
                      <p className="text-sm text-muted">
                        {item.filial.nome} ·{" "}
                        {item.servicos.map((s) => s.servico.nome).join(", ")}
                      </p>
                    </div>
                    <Link
                      className="rounded-lg border border-border px-4 py-2 text-primary focus-visible:outline-primary"
                      to={`/barbeiro/agenda/${item.id}`}
                      state={{ retorno: `/barbeiro/agenda?${params}` }}
                    >
                      Visualizar #{item.id}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
          {!erro && !consulta.isError && consulta.data && (
            <nav
              aria-label="Paginação da agenda"
              className="mt-4 grid grid-cols-2 items-center gap-3 border-t border-border pt-4 sm:flex sm:justify-between"
            >
              <Button
                variant="secondary"
                isDisabled={pagina <= 1}
                onPress={() => {
                  const novos = new URLSearchParams(params);
                  novos.set("pagina", String(pagina - 1));
                  definirParams(novos);
                }}
              >
                Anterior
              </Button>
              <span className="order-first col-span-2 text-center text-xs sm:order-none">
                {consulta.data.meta.total} agendamentos · Página {pagina} de{" "}
                {Math.max(1, consulta.data.meta.totalPaginas)}
              </span>
              <Button
                variant="secondary"
                isDisabled={pagina >= consulta.data.meta.totalPaginas}
                onPress={() => {
                  const novos = new URLSearchParams(params);
                  novos.set("pagina", String(pagina + 1));
                  definirParams(novos);
                }}
              >
                Próxima
              </Button>
            </nav>
          )}
        </Cartao>
      )}
    </DashboardLayout>
  );
}
