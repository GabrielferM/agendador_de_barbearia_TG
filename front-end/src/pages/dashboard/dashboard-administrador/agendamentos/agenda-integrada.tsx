import { NovoAgendamentoAdmin } from "./novo-agendamento";
import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { AgendamentoControllerListarParams } from "../../../../api/models";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
} from "../../components/dashboard-compartilhado";
import { nomeStatus } from "../../components/dashboard-formatadores";
import { dataHorario } from "../../../agendamento/formatadores";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { ResumoAgendamento } from "../../../agendamento/components/resumo-agendamento";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  DialogoOperacao,
  PaginacaoCadastros,
} from "../components/dialogo-operacao";
import { AcoesAtendimento } from "../../dashboard-barbeiro/agenda/components/acoes-atendimento";
import { HistoricoAtendimento } from "../../dashboard-barbeiro/agenda/components/historico-atendimento";
import {
  listarAgendaAdmin,
  detalheAdmin,
  atualizarAdmin,
  gradeAdmin,
} from "./services/agenda-admin-api";
import { todasFiliais, seletoresPessoas } from "../services/cadastros-api";
import { texto } from "../services/operacoes-api";
const STATUS = [
  "PENDENTE",
  "CONFIRMADO",
  "EM_ATENDIMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "NAO_COMPARECEU",
];
export function AgendaIntegrada() {
  const { usuario } = useAutenticacao();
  const [params] = useSearchParams();
  const [id, definirId] = useState<number | null>(
    () => Number(params.get("detalhe")) || null,
  );
  const [dia] = useState(() =>
    new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(
      new Date(),
    ),
  );
  const [filtros, definirFiltros] = useState<AgendamentoControllerListarParams>(
    {
      inicioDe: `${dia}T00:00:00-03:00`,
      inicioAte: `${dia}T23:59:59.999-03:00`,
    },
  );
  const [pagina, mudar] = useState(1);
  const [grade, definirGrade] = useState(false);
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_AGENDAMENTOS");
  const podePessoas = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const podeFiliais = !!usuario?.permissoes.includes("GERENCIAR_FILIAIS");
  const lista = useQuery({
    queryKey: ["agenda-admin", usuario?.id, filtros, pagina],
    queryFn: ({ signal }) =>
      listarAgendaAdmin({ ...filtros, pagina, limite: 10 }, signal),
    enabled: permitido && !grade,
    retry: false,
  });
  const completa = useQuery({
    queryKey: ["agenda-admin", usuario?.id, "grade", filtros],
    queryFn: ({ signal }) => gradeAdmin(filtros, signal),
    enabled: permitido && grade,
    retry: false,
  });
  const detalhe = useQuery({
    queryKey: ["atendimento", usuario?.id, id],
    queryFn: ({ signal }) => detalheAdmin(id!, signal),
    enabled: permitido && id !== null,
    retry: false,
  });
  const filiais = useQuery({
    queryKey: ["admin-filiais", usuario?.id, "seletor"],
    queryFn: ({ signal }) => todasFiliais(signal),
    enabled: permitido && podeFiliais,
    retry: false,
  });
  const barbeiros = useQuery({
    queryKey: ["admin-barbeiros", usuario?.id, "seletor"],
    queryFn: ({ signal }) => seletoresPessoas("barbeiros", signal),
    enabled: permitido && podePessoas,
    retry: false,
  });
  const clientes = useQuery({
    queryKey: ["admin-clientes", usuario?.id, "seletor"],
    queryFn: ({ signal }) => seletoresPessoas("clientes", signal),
    enabled: permitido && podePessoas,
    retry: false,
  });
  const [novo, definirNovo] = useState(false);
  const itens = grade ? completa.data : lista.data?.data;
  const consulta = grade ? completa : lista;
  return (
    <DashboardLayout
      titulo="Agendamentos"
      subtitulo="Agenda no fuso de Brasília"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">
          Você não possui permissão para gerenciar agendamentos.
        </p>
      ) : (
        <>
          <Button
            className="mb-4"
            isDisabled={!podePessoas || !podeFiliais}
            onPress={() => definirNovo(true)}
          >
            Novo agendamento
          </Button>
          {novo && <NovoAgendamentoAdmin fechar={() => definirNovo(false)} />}
          {(!podePessoas || !podeFiliais) && (
            <p className="mb-4 text-sm text-muted">
              Criação exige permissões para selecionar cliente e filial.
            </p>
          )}
          <form
            className="mb-5 flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              const de = String(form.get("de"));
              const ate = String(form.get("ate"));
              const numerico = (campo: string) =>
                Number(form.get(campo)) || undefined;
              definirFiltros({
                inicioDe: `${de}T00:00:00-03:00`,
                inicioAte: `${ate}T23:59:59.999-03:00`,
                idFilial: numerico("filial"),
                idBarbeiro: numerico("barbeiro"),
                idCliente: numerico("cliente"),
                status:
                  (String(
                    form.get("status") || "",
                  ) as AgendamentoControllerListarParams["status"]) ||
                  undefined,
              });
              mudar(1);
            }}
          >
            <label>
              De
              <input
                type="date"
                name="de"
                required
                defaultValue={dia}
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <label>
              Até
              <input
                type="date"
                name="ate"
                required
                defaultValue={dia}
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <label>
              Situação
              <select
                name="status"
                className="block rounded-lg border border-border bg-surface p-2"
              >
                <option value="">Todas</option>
                {STATUS.map((s) => (
                  <option key={s} value={s}>
                    {nomeStatus(s)}
                  </option>
                ))}
              </select>
            </label>
            {[
              [podeFiliais, filiais, "filial", "Filial"],
              [podePessoas, barbeiros, "barbeiro", "Barbeiro"],
              [podePessoas, clientes, "cliente", "Cliente"],
            ].map(
              ([autorizado, dados, nome, rotulo]) =>
                autorizado && (
                  <label key={String(nome)}>
                    {String(rotulo)}
                    <select
                      name={String(nome)}
                      className="block rounded-lg border border-border bg-surface p-2"
                    >
                      <option value="">Todos</option>
                      {(dados as typeof filiais).data?.map((item) => (
                        <option key={Number(item.id)} value={String(item.id)}>
                          {texto(item.nome)}
                        </option>
                      ))}
                    </select>
                  </label>
                ),
            )}
            <Button type="submit">Aplicar filtros</Button>
            <Button
              type="reset"
              variant="secondary"
              onPress={() => {
                definirFiltros({
                  inicioDe: `${dia}T00:00:00-03:00`,
                  inicioAte: `${dia}T23:59:59.999-03:00`,
                });
                mudar(1);
              }}
            >
              Hoje / limpar
            </Button>
          </form>
          {[filiais, barbeiros, clientes].some((q) => q.isError) && (
            <p role="alert" className="mb-3 text-danger">
              Não foi possível carregar um dos seletores. Atualize a consulta.
            </p>
          )}
          <div className="mb-4 flex gap-3">
            <Button variant="secondary" onPress={() => definirGrade((g) => !g)}>
              {grade ? "Lista paginada" : "Grade do período completo"}
            </Button>
            <Button variant="secondary" onPress={() => void consulta.refetch()}>
              Atualizar
            </Button>
          </div>
          <Cartao
            titulo={
              grade ? "Agenda do período completo" : "Agendamentos da página"
            }
          >
            <p className="mb-4 text-sm text-muted">
              {itens?.length ?? 0} atendimentos exibidos
              {!grade && lista.data
                ? ` · ${lista.data.meta.total} no filtro`
                : ""}
              .
            </p>
            <EstadoConsulta
              carregando={consulta.isPending}
              erro={consulta.error}
              vazio={!itens?.length}
              tentar={() => void consulta.refetch()}
            >
              <div
                className={
                  grade
                    ? "grid gap-3 sm:grid-cols-2 xl:grid-cols-3"
                    : "divide-y divide-border"
                }
              >
                {itens?.map((item) => (
                  <article key={item.id} className="py-3">
                    <h2 className="font-semibold">
                      {item.cliente.nome} · {nomeStatus(item.status)}
                    </h2>
                    <p className="text-sm">
                      {dataHorario(item.inicioPrevisto)} ·{" "}
                      {item.barbeiro.nomeProfissional} · {item.filial.nome}
                    </p>
                    <Button
                      className="mt-2"
                      variant="secondary"
                      onPress={() => definirId(item.id)}
                    >
                      Visualizar #{item.id}
                    </Button>
                  </article>
                ))}
              </div>
            </EstadoConsulta>
          </Cartao>
          {!grade && lista.data && (
            <PaginacaoCadastros
              {...lista.data.meta}
              pagina={pagina}
              mudar={mudar}
            />
          )}
          <DialogoOperacao
            titulo={`Agendamento #${id}`}
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
                <>
                  <h3 className="mb-4 font-semibold">
                    {detalhe.data.cliente.nome} ·{" "}
                    {nomeStatus(detalhe.data.status)}
                  </h3>
                  <ResumoAgendamento item={detalhe.data} />
                  {detalhe.data.observacaoInterna && (
                    <p className="mt-3">
                      Observação interna: {detalhe.data.observacaoInterna}
                    </p>
                  )}
                  <AcoesAtendimento
                    item={detalhe.data}
                    atualizar={atualizarAdmin}
                  />
                  <HistoricoAtendimento key={id} id={id!} />
                </>
              )}
            </EstadoConsulta>
          </DialogoOperacao>
        </>
      )}
    </DashboardLayout>
  );
}
