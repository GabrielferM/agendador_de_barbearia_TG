import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
  EstadoCarregamento,
  EstadoErro,
} from "../components/dashboard-compartilhado";
import { dataHorario, moeda } from "../../agendamento/formatadores";
import { nomeStatus } from "../components/dashboard-formatadores";
import { MENU_BARBEIRO } from "./menu-barbeiro";
import { campoBarbeiro, validarFiltros } from "./periodo-barbeiro";
import {
  consultarClientes,
  consultarServicos,
  consultarHistorico,
} from "./consultas-barbeiro-api";
import type { DashboardBarbeiroControllerHistoricoParams } from "../../../api/models";

type Tela = "clientes" | "servicos" | "historico";
const titulos = {
  clientes: "Clientes",
  servicos: "Meus serviços",
  historico: "Histórico de atendimentos",
};
const subtitulos = {
  clientes: "Clientes com agendamentos vinculados a você",
  servicos: "Catálogo disponível e desempenho dos seus atendimentos concluídos",
  historico: "Seus atendimentos concluídos, cancelados e não comparecimentos",
};
export function ConsultasBarbeiro({ tela }: { tela: Tela }) {
  const { usuario } = useAutenticacao();
  const [params, definirParams] = useSearchParams();
  const { de, ate, pagina, status, idCliente, erro } = validarFiltros(
    params,
    true,
  );
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA");
  const filtros = {
    pagina,
    limite: 10,
    busca: params.get("busca") ?? "",
    inicioDe: de,
    inicioAte: ate,
  };
  const consulta = useQuery({
    queryKey: ["barbeiro", tela, usuario?.id, filtros, status, idCliente],
    enabled: permitido && !erro,
    retry: false,
    queryFn: async ({ signal }) => {
      if (tela === "clientes")
        return {
          tipo: "clientes" as const,
          ...(await consultarClientes(
            { pagina, limite: 10, busca: filtros.busca },
            signal,
          )),
        };
      if (tela === "servicos")
        return {
          tipo: "servicos" as const,
          ...(await consultarServicos(filtros, signal)),
        };
      return {
        tipo: "historico" as const,
        ...(await consultarHistorico(
          {
            ...filtros,
            idCliente,
            status: status
              ? (status as DashboardBarbeiroControllerHistoricoParams["status"])
              : undefined,
          },
          signal,
        )),
      };
    },
  });
  const paginar = (n: number) => {
    const novos = new URLSearchParams(params);
    novos.set("pagina", String(n));
    definirParams(novos);
  };
  return (
    <DashboardLayout
      fusoHorario="America/Sao_Paulo"
      titulo={titulos[tela]}
      subtitulo={subtitulos[tela]}
      itens={MENU_BARBEIRO}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar esta área.</p>
      ) : (
        <Cartao>
          <form
            key={params.toString()}
            className="mb-4 flex flex-col items-stretch gap-3 border-b border-border pb-4 sm:flex-row sm:flex-wrap sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              const dados = new FormData(e.currentTarget);
              const novos = new URLSearchParams();
              dados.forEach((v, k) => {
                if (String(v)) novos.set(k, String(v));
              });
              if (idCliente) novos.set("cliente", String(idCliente));
              novos.set("pagina", "1");
              definirParams(novos);
            }}
          >
            {tela !== "historico" && (
              <label className="min-w-0 flex-1 text-sm">
                Buscar por nome
                <input
                  name="busca"
                  maxLength={100}
                  defaultValue={filtros.busca}
                  className={campoBarbeiro}
                  placeholder={
                    tela === "clientes" ? "Nome do cliente" : "Nome do serviço"
                  }
                />
              </label>
            )}
            {tela !== "clientes" && (
              <>
                <label className="text-sm">
                  De
                  <input
                    type="date"
                    name="de"
                    required
                    defaultValue={de}
                    className={campoBarbeiro}
                  />
                </label>
                <label className="text-sm">
                  Até
                  <input
                    type="date"
                    name="ate"
                    required
                    defaultValue={ate}
                    className={campoBarbeiro}
                  />
                </label>
              </>
            )}
            {tela === "historico" && (
              <label className="text-sm">
                Situação
                <select
                  name="status"
                  defaultValue={status}
                  className={campoBarbeiro}
                >
                  <option value="">Todos os encerrados</option>
                  {["CONCLUIDO", "CANCELADO", "NAO_COMPARECEU"].map((s) => (
                    <option key={s} value={s}>
                      {nomeStatus(s)}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <Button type="submit">Aplicar filtros</Button>
            <Button variant="secondary" onPress={() => definirParams({})}>
              Limpar
            </Button>
          </form>
          {tela === "historico" && (
            <Link
              className="mb-3 inline-block text-sm text-primary underline"
              to="/barbeiro/clientes"
            >
              Selecionar cliente da minha carteira
            </Link>
          )}
          {idCliente && tela === "historico" && (
            <p className="mb-3 text-sm">
              Histórico filtrado pelo cliente #{idCliente}.{" "}
              <button
                className="text-primary underline"
                onClick={() => {
                  const novos = new URLSearchParams(params);
                  novos.delete("cliente");
                  novos.set("pagina", "1");
                  definirParams(novos);
                }}
              >
                Ver todos os clientes
              </button>
            </p>
          )}
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
                  : "Não foi possível carregar os dados."
              }
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : !consulta.data?.data.length ? (
            <div role="status" className="py-12 text-center">
              <p className="font-semibold">Nenhum registro encontrado.</p>
              <p className="mt-1 text-sm text-muted">
                Altere os filtros para consultar outro período ou nome.
              </p>
            </div>
          ) : (
            <div className="max-w-full overflow-x-auto">
              {consulta.data.tipo === "clientes" && (
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-background">
                    <tr>
                      {[
                        "Cliente",
                        "Último atendimento",
                        "Próximo agendamento",
                        "Concluídos",
                        "Ação",
                      ].map((t) => (
                        <th scope="col" className="p-3" key={t}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {consulta.data.data.map((c) => (
                      <tr className="border-b border-border" key={c.id}>
                        <td className="p-3 font-medium">{c.nome}</td>
                        <td className="p-3">
                          {c.ultimoAtendimento
                            ? dataHorario(c.ultimoAtendimento)
                            : "Sem atendimento concluído"}
                        </td>
                        <td className="p-3">
                          {c.proximoAgendamento
                            ? dataHorario(c.proximoAgendamento)
                            : "Sem agendamento futuro"}
                        </td>
                        <td className="p-3">{c.atendimentosConcluidos}</td>
                        <td className="p-3">
                          <Link
                            className="text-primary underline"
                            to={`/barbeiro/historico?cliente=${c.id}`}
                          >
                            Ver histórico
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {consulta.data.tipo === "servicos" && (
                <>
                  <p className="mb-3 text-xs text-muted">
                    Preço-base atual do catálogo. Receita calculada pelos
                    subtotais históricos aplicados, sem representar pagamentos
                    ou comissões.
                  </p>
                  <table className="w-full min-w-160 text-left text-sm">
                    <thead className="bg-background">
                      <tr>
                        {[
                          "Serviço",
                          "Duração",
                          "Preço-base atual",
                          "Situação",
                          "Unidades no período",
                          "Receita concluída",
                        ].map((t) => (
                          <th scope="col" className="p-3" key={t}>
                            {t}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {consulta.data.data.map((s) => (
                        <tr className="border-b border-border" key={s.id}>
                          <td className="max-w-64 p-3">
                            <p className="font-medium">{s.nome}</p>
                            {s.descricao && (
                              <p className="mt-1 text-xs text-muted">
                                {s.descricao}
                              </p>
                            )}
                          </td>
                          <td className="p-3">{s.duracaoMinutos} min</td>
                          <td className="p-3">{moeda(Number(s.precoBase))}</td>
                          <td className="p-3">
                            {s.ativo ? "Ativo" : "Inativo · com histórico"}
                          </td>
                          <td className="p-3">{s.quantidade}</td>
                          <td className="p-3">{moeda(Number(s.receita))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {consulta.data.tipo === "historico" && (
                <table className="w-full min-w-160 text-left text-sm">
                  <thead className="bg-background">
                    <tr>
                      {[
                        "Data e horário",
                        "Cliente",
                        "Serviços",
                        "Situação",
                        "Ação",
                      ].map((t) => (
                        <th scope="col" className="p-3" key={t}>
                          {t}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {consulta.data.data.map((a) => (
                      <tr className="border-b border-border" key={a.id}>
                        <td className="p-3">{dataHorario(a.inicioPrevisto)}</td>
                        <td className="p-3 font-medium">{a.cliente.nome}</td>
                        <td className="p-3">
                          {a.servicos
                            .map((s) => `${s.quantidade}× ${s.servico.nome}`)
                            .join(", ")}
                        </td>
                        <td className="p-3">
                          <span className="rounded-full bg-background px-2 py-1 text-xs">
                            {nomeStatus(a.status)}
                          </span>
                        </td>
                        <td className="p-3">
                          <Link
                            className="text-primary underline"
                            to={`/barbeiro/agenda/${a.id}`}
                            state={{ retorno: `/barbeiro/historico?${params}` }}
                          >
                            Visualizar
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
          {!erro && !consulta.isError && consulta.data && (
            <nav
              aria-label="Paginação"
              className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"
            >
              <Button
                variant="secondary"
                isDisabled={pagina <= 1}
                onPress={() => paginar(pagina - 1)}
              >
                Anterior
              </Button>
              <span className="text-xs">
                {consulta.data.meta.total} registros · Página {pagina} de{" "}
                {Math.max(1, consulta.data.meta.totalPaginas)}
              </span>
              <Button
                variant="secondary"
                isDisabled={pagina >= consulta.data.meta.totalPaginas}
                onPress={() => paginar(pagina + 1)}
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
