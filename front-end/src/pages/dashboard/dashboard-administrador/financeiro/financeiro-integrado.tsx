import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { ComissaoControllerListarParams } from "../../../../api/models";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  Barras,
  Cartao,
  DashboardLayout,
  Kpi,
} from "../../components/dashboard-compartilhado";
import { moeda } from "../../components/dashboard-formatadores";
import { dataHorario } from "../../../agendamento/formatadores";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  DialogoOperacao,
  PaginacaoCadastros,
} from "../components/dialogo-operacao";
import { objeto, texto } from "../services/operacoes-api";
import { seletoresPessoas } from "../services/cadastros-api";
import {
  painelFinanceiro,
  listarComissoes,
  detalheComissao,
} from "./services/financeiro-api";
export function FinanceiroIntegrado() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_COMISSOES");
  const podePessoas = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const podeAgenda = !!usuario?.permissoes.includes("GERENCIAR_AGENDAMENTOS");
  const [periodo, definirPeriodo] = useState<{
    inicioDe?: string;
    inicioAte?: string;
  }>({});
  const [filtros, definirFiltros] = useState<ComissaoControllerListarParams>(
    {},
  );
  const [pagina, mudar] = useState(1);
  const [id, definirId] = useState<number | null>(null);
  const painel = useQuery({
    queryKey: ["admin-financeiro", usuario?.id, periodo],
    queryFn: ({ signal }) => painelFinanceiro(periodo, signal),
    enabled: permitido,
    retry: false,
  });
  const lista = useQuery({
    queryKey: ["comissoes", usuario?.id, filtros, pagina],
    queryFn: ({ signal }) =>
      listarComissoes({ ...filtros, pagina, limite: 10 }, signal),
    enabled: permitido,
    retry: false,
  });
  const detalhe = useQuery({
    queryKey: ["comissao", usuario?.id, id],
    queryFn: ({ signal }) => detalheComissao(id!, signal),
    enabled: permitido && id !== null,
    retry: false,
  });
  const barbeiros = useQuery({
    queryKey: ["admin-barbeiros", usuario?.id, "seletor"],
    queryFn: ({ signal }) => seletoresPessoas("barbeiros", signal),
    enabled: permitido && podePessoas,
    retry: false,
  });
  return (
    <DashboardLayout
      titulo="Financeiro"
      subtitulo="Receita calculada e comissões cadastradas"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar comissões.</p>
      ) : (
        <>
          <form
            className="mb-5 flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const dados = new FormData(e.currentTarget);
              const de = String(dados.get("de"));
              const ate = String(dados.get("ate"));
              definirPeriodo({
                inicioDe: de ? `${de}T00:00:00-03:00` : undefined,
                inicioAte: ate ? `${ate}T23:59:59.999-03:00` : undefined,
              });
            }}
          >
            <label>
              De
              <input
                name="de"
                type="date"
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <label>
              Até
              <input
                name="ate"
                type="date"
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <Button type="submit">Aplicar período</Button>
            <Button
              type="reset"
              variant="secondary"
              onPress={() => definirPeriodo({})}
            >
              Limpar período
            </Button>
            <Button
              variant="secondary"
              onPress={() => {
                void painel.refetch();
                void lista.refetch();
              }}
            >
              Atualizar
            </Button>
          </form>
          <EstadoConsulta
            carregando={painel.isPending}
            erro={painel.error}
            vazio={false}
            tentar={() => void painel.refetch()}
          >
            {painel.data && (
              <>
                <p className="mb-4 text-sm text-muted">
                  Período {painel.data.periodo.inicioDe} a{" "}
                  {painel.data.periodo.inicioAte}. Receita usa início previsto
                  de atendimentos concluídos; comissões usam data de geração.
                  Não representa confirmação de recebimento do cliente.
                </p>
                <div className="mb-5 grid gap-3 sm:grid-cols-3">
                  <Kpi
                    rotulo="Receita calculada"
                    valor={moeda.format(painel.data.indicadores.receita)}
                    detalhe="Subtotal de serviços concluídos"
                    icone="financeiro"
                  />
                  <Kpi
                    rotulo="Variação de receita"
                    valor={`${painel.data.indicadores.variacaoReceitaPercentual}%`}
                    detalhe="Período anterior equivalente"
                    icone="financeiro"
                  />
                  <Kpi
                    rotulo="Comissões cadastradas"
                    valor={moeda.format(painel.data.indicadores.comissoes)}
                    detalhe="Todos os status incluídos"
                    icone="usuarios"
                  />
                </div>
                <div className="grid gap-4 xl:grid-cols-2">
                  <Cartao titulo="Receita semanal">
                    <Barras
                      moedaValores
                      pontos={painel.data.fluxoSemanal.map((s) => ({
                        data: s.inicio,
                        valor: s.receita,
                      }))}
                    />
                  </Cartao>
                  <Cartao titulo="Últimos atendimentos concluídos">
                    <ul className="divide-y divide-border">
                      {painel.data.movimentacoesRecentes.map((item) => (
                        <li key={item.id} className="py-3">
                          <p>{item.descricao}</p>
                          <p className="text-sm">
                            {dataHorario(item.data)} ·{" "}
                            {moeda.format(item.valor)}
                          </p>
                          {podeAgenda && (
                            <Link
                              to={`/admin/agendamentos?detalhe=${item.id}`}
                              className="text-primary underline"
                            >
                              Ver atendimento
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                    {!painel.data.movimentacoesRecentes.length && (
                      <p>Nenhum atendimento no período.</p>
                    )}
                  </Cartao>
                </div>
                <Cartao
                  className="mt-4"
                  titulo="Comissões por barbeiro no período"
                >
                  <ul className="space-y-4">
                    {painel.data.comissoesPorBarbeiro.map((item) => (
                      <li key={item.id}>
                        <strong>
                          {item.barbeiro} · Total cadastrado{" "}
                          {moeda.format(item.total)}
                        </strong>
                        <p className="text-sm text-muted">
                          {Object.entries(item.porStatus)
                            .map(
                              ([status, valor]) =>
                                `${status}: ${moeda.format(valor)}`,
                            )
                            .join(" · ")}
                        </p>
                      </li>
                    ))}
                  </ul>
                  {!painel.data.comissoesPorBarbeiro.length && (
                    <p>Nenhuma comissão cadastrada no período.</p>
                  )}
                </Cartao>
              </>
            )}
          </EstadoConsulta>
          <Cartao
            className="mt-5"
            titulo="Comissões cadastradas — todos os períodos"
          >
            <p className="mb-4 text-sm text-muted">
              A tabela usa barbeiro/situação e não acompanha o período do
              painel.
            </p>
            <form
              className="mb-5 flex flex-wrap items-end gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                const dados = new FormData(e.currentTarget);
                definirFiltros({
                  idBarbeiro: Number(dados.get("barbeiro")) || undefined,
                  status:
                    (String(
                      dados.get("status") || "",
                    ) as ComissaoControllerListarParams["status"]) || undefined,
                });
                mudar(1);
              }}
            >
              {podePessoas && (
                <label>
                  Barbeiro
                  <select
                    name="barbeiro"
                    className="block rounded-lg border border-border bg-surface p-2"
                  >
                    <option value="">Todos</option>
                    {barbeiros.data?.map((b) => (
                      <option key={Number(b.id)} value={String(b.id)}>
                        {texto(b.nome)}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label>
                Situação
                <select
                  name="status"
                  className="block rounded-lg border border-border bg-surface p-2"
                >
                  <option value="">Todas</option>
                  {[
                    "PREVISTA",
                    "LIBERADA",
                    "PAGA",
                    "CANCELADA",
                    "ESTORNADA",
                  ].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </label>
              <Button type="submit">Filtrar comissões</Button>
              <Button
                type="reset"
                variant="secondary"
                onPress={() => {
                  definirFiltros({});
                  mudar(1);
                }}
              >
                Limpar
              </Button>
            </form>
            {barbeiros.isError && (
              <p role="alert">Seletor de barbeiros indisponível.</p>
            )}
            <EstadoConsulta
              carregando={lista.isPending}
              erro={lista.error}
              vazio={!lista.data?.data.length}
              tentar={() => void lista.refetch()}
            >
              <ul className="divide-y divide-border">
                {lista.data?.data.map((item) => (
                  <li
                    key={Number(item.id)}
                    className="flex flex-wrap items-center justify-between gap-3 py-3"
                  >
                    <span>
                      #{String(item.id)} ·{" "}
                      {objeto(item.barbeiro) && objeto(item.barbeiro.usuario)
                        ? texto(item.barbeiro.usuario.nome)
                        : ""}{" "}
                      · {texto(item.status)} ·{" "}
                      {moeda.format(Number(item.valorComissao))}
                    </span>
                    <Button
                      variant="secondary"
                      onPress={() => definirId(Number(item.id))}
                    >
                      Visualizar comissão
                    </Button>
                  </li>
                ))}
              </ul>
            </EstadoConsulta>
            {lista.data && (
              <PaginacaoCadastros
                {...lista.data.meta}
                pagina={pagina}
                mudar={mudar}
              />
            )}
          </Cartao>
          <DialogoOperacao
            titulo={`Comissão #${id}`}
            aberto={id !== null}
            fechar={() => definirId(null)}
          >
            <EstadoConsulta
              carregando={detalhe.isPending}
              erro={detalhe.error}
              vazio={!detalhe.data}
              tentar={() => void detalhe.refetch()}
            >
              {detalhe.data && (
                <dl className="space-y-3">
                  {[
                    ["status", "Situação"],
                    ["baseCalculo", "Base de cálculo"],
                    ["percentualAplicado", "Percentual aplicado"],
                    ["valorComissao", "Valor da comissão"],
                    ["dataGeracao", "Data de geração"],
                    ["dataLiberacao", "Data de liberação"],
                    ["dataPagamento", "Data de pagamento"],
                    ["dataEstorno", "Data de estorno"],
                    ["motivoEstorno", "Motivo do estorno"],
                    ["observacao", "Observação"],
                  ].map(([campo, rotulo]) => (
                    <div key={campo}>
                      <dt className="text-muted">{rotulo}</dt>
                      <dd>
                        {campo.startsWith("data") && detalhe.data[campo]
                          ? dataHorario(texto(detalhe.data[campo]))
                          : texto(detalhe.data[campo]) || "Não informado"}
                      </dd>
                    </div>
                  ))}
                  {podeAgenda && objeto(detalhe.data.agendamentoServico) && (
                    <Link
                      className="text-primary underline"
                      to={`/admin/agendamentos?detalhe=${detalhe.data.agendamentoServico.idAgendamento}`}
                    >
                      Ver atendimento
                    </Link>
                  )}
                </dl>
              )}
            </EstadoConsulta>
          </DialogoOperacao>
        </>
      )}
    </DashboardLayout>
  );
}
