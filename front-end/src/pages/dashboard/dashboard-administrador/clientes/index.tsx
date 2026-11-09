import { useConsultaListagem } from '../../components/use-consulta-listagem';
import { ResultadosListagem } from '../../components/resultados-listagem';
import { DialogoAdministrativo } from "../components/dialogo-administrativo";
import { schemaCliente } from "../components/schemas-cadastro";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  FormularioCadastro,
  estiloBotao,
  estiloCampo,
} from "../components/formulario-cadastro";
import type { CampoCadastro } from "../components/formulario-cadastro";
import {
  buscarCliente,
  consultarClientes,
  excluirCliente,
  salvarCliente,
} from "./services/clientes-api";

import {
  PainelCatalogo,
  FaixaIndicadores,
  PaginacaoCatalogo,
  ConfirmacaoExclusao,
} from "../components/painel-catalogo";
import { BadgeStatus } from "../components/componentes-administrativos";

export function ClientesAdministrador() {
  const { usuario } = useAutenticacao(),
    cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const [busca, setBusca] = useState(""),
    [status, setStatus] = useState(""),
    [pagina, setPagina] = useState(1);
  const [filtrosAplicados, setFiltrosAplicados] = useState({ busca: '', status: '' });
  const [editor, setEditor] = useState<{
    id: number | null;
    dados: Record<string, string>;
    leitura: boolean;
  } | null>(null);
  const [excluir, setExcluir] = useState<number | null>(null),
    [aviso, setAviso] = useState("");
  const consulta = useConsultaListagem({
    queryKey: ["admin", usuario?.id, "clientes", filtrosAplicados.busca, filtrosAplicados.status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) =>
      consultarClientes(
        {
          busca: filtrosAplicados.busca,
          status: filtrosAplicados.status
            ? (filtrosAplicados.status as "ATIVO" | "INATIVO" | "BLOQUEADO")
            : undefined,
          pagina,
        },
        signal,
      ),
  });
  const abrir = useMutation({
    mutationFn: ({ id }: { id: number; leitura: boolean }) => buscarCliente(id),
    onMutate: () => gravar.reset(),
    onSuccess: (dados, { id, leitura }) => {
      setEditor({ id, dados, leitura });
      setAviso("");
    },
  });
  const gravar = useMutation({
    mutationFn: (dados: Record<string, string>) =>
      salvarCliente(editor!.id, dados),
    onSuccess: async () => {
      setEditor(null);
      setAviso("Cliente salvo.");
      await cache.invalidateQueries();
    },
  });
  const remover = useMutation({
    mutationFn: excluirCliente,
    onSuccess: async () => {
      setExcluir(null);
      setAviso("Cliente excluído.");
      setPagina(1);
      await cache.invalidateQueries();
    },
  });
  const campos: CampoCadastro[] = [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, tamanhoMinimo: 2 },
    { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
    { nome: "cpf", rotulo: "CPF", obrigatorio: true },
    { nome: "telefone", rotulo: "Telefone" },
    {
      grupo: "Aniversário (opcional)",
      nome: "diaAniversario",
      rotulo: "Dia do aniversário (opcional)",
      tipo: "number",
      minimo: 1,
      maximo: 31,
    },
    {
      grupo: "Aniversário (opcional)",
      nome: "mesAniversario",
      rotulo: "Mês do aniversário (opcional)",
      opcoes: Array.from({ length: 12 }, (_, i) => ({
        valor: String(i + 1),
        rotulo: new Intl.DateTimeFormat("pt-BR", {
          month: "long",
          timeZone: "UTC",
        }).format(new Date(Date.UTC(2000, i, 1))),
      })),
    },
    { nome: "observacao", rotulo: "Observação", tipo: "textarea" },
    ...(!editor?.leitura
      ? [
          {
            nome: "senha",
            rotulo: editor?.id ? "Nova senha (opcional)" : "Senha",
            tipo: "password" as const,
            tamanhoMinimo: 15,
            obrigatorio: editor?.id === null,
          },
        ]
      : []),
    ...(editor?.id
      ? [
          {
            nome: "status",
            rotulo: "Status",
            obrigatorio: true,
            opcoes: ["ATIVO", "INATIVO", "BLOQUEADO"].map((valor) => ({
              valor,
              rotulo: valor,
            })),
          },
        ]
      : []),
  ];
  const erro =
    gravar.error ?? (excluir === null ? remover.error : null) ?? abrir.error;
  const data = (v: string | null) =>
    v
      ? new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(v))
      : "—";
  return (
    <DashboardLayout
      titulo="Clientes"
      subtitulo="Consulte e gerencie os clientes cadastrados"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para gerenciar clientes.</p>
      ) : (
        <PainelCatalogo>
          {consulta.data && (
            <FaixaIndicadores
              itens={[
                {
                  titulo: "Clientes ativos",
                  valor: String(consulta.data.ativos),
                },
                {
                  titulo: "Novos no mês",
                  valor: String(consulta.data.novosNoMes),
                },
                {
                  titulo: "Retorno agendado",
                  valor: String(consulta.data.retornoAgendado),
                },
              ]}
            />
          )}
          <form
            className="filtros-catalogo"
            onSubmit={(evento) => {
              evento.preventDefault();
              if (consulta.isFetching) return;
              if (pagina === 1 && filtrosAplicados.busca === busca && filtrosAplicados.status === status) {
                void consulta.refetch();
              } else {
                void cache.invalidateQueries({ queryKey: ['admin', usuario?.id, 'clientes', busca, status, 1], exact: true, refetchType: 'none' });
                setFiltrosAplicados({ busca, status });
                setPagina(1);
              }
            }}
          >
            <label>
              Buscar por nome, telefone ou e-mail
              <input
                placeholder="Nome, telefone ou e-mail"
                className={estiloCampo}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                }}
              />
            </label>
            <label>
              Status
              <select
                className={estiloCampo}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="">Todos</option>
                {["ATIVO", "INATIVO", "BLOQUEADO"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button type="submit" className={estiloBotao} disabled={consulta.isFetching}>
              Buscar
            </button>
            <button
              type="button"
              className={`${estiloBotao} bg-primary! text-white sm:ml-auto`}
              data-novo-cadastro
              onClick={() => {
                gravar.reset();
                abrir.reset();
                remover.reset();
                setAviso("");
                setEditor({ id: null, dados: {}, leitura: false });
              }}
            >
              Novo cliente
            </button>
          </form>
          {aviso && <p role="status">{aviso}</p>}
          {erro && !editor && <p role="alert">{erro.message}</p>}
          <div className="px-4">
            {editor && (
              <DialogoAdministrativo
                titulo={
                  editor.leitura
                    ? "Detalhes do cliente"
                    : editor.id === null
                      ? "Novo cliente"
                      : "Editar cliente"
                }
                pendente={gravar.isPending}
                fechar={() => setEditor(null)}
              >
                <FormularioCadastro
                  schema={schemaCliente(editor?.id !== null)}
                  key={`${editor.id}-${editor.leitura}`}
                  campos={campos}
                  valores={editor.dados}
                  somenteLeitura={editor.leitura}
                  pendente={gravar.isPending}
                  erro={gravar.error?.message}
                  salvar={(dados) => gravar.mutateAsync(dados)}
                  fechar={() => setEditor(null)}
                  acoes={
                    editor.leitura && (
                      <button
                        type="button"
                        className={estiloBotao}
                        onClick={() => {
                          gravar.reset();
                          setEditor({ ...editor, leitura: false });
                        }}
                      >
                        Editar cliente
                      </button>
                    )
                  }
                />
              </DialogoAdministrativo>
            )}
            {excluir !== null && (
              <ConfirmacaoExclusao
                pendente={remover.isPending}
                fechar={() => setExcluir(null)}
              >
                <h2 className="mb-2 font-semibold">Excluir cliente?</h2>
                <p className="mb-4 text-sm">
                  Excluir{" "}
                  {consulta.data?.data.find((c) => c.id === excluir)?.nome ??
                    "este cliente"}
                  ? Agendamentos vinculados impedem a exclusão. Para preservar o
                  cadastro, edite o status.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={estiloBotao}
                    disabled={remover.isPending}
                    onClick={() => remover.mutate(excluir)}
                  >
                    Confirmar exclusão
                  </button>
                  <button
                    data-foco-inicial
                    className={estiloBotao}
                    disabled={remover.isPending}
                    onClick={() => setExcluir(null)}
                  >
                    Cancelar
                  </button>
                </div>
                {remover.error && (
                  <p className="mt-3 text-danger" role="alert">
                    {remover.error.message}
                  </p>
                )}
              </ConfirmacaoExclusao>
            )}
          </div>
          <ResultadosListagem
            atualizando={consulta.isFetching && !!consulta.data}
            erro={consulta.isError && !!consulta.data}
            tentarNovamente={() => void consulta.refetch()}
          >
            {consulta.isPending && !consulta.data ? (
              <EstadoCarregamento />
            ) : !consulta.data ? (
              <EstadoErro
                mensagem={consulta.error?.message ?? 'Não foi possível carregar os dados.'}
                tentarNovamente={() => void consulta.refetch()}
              />
            ) : (
              <>
                <div className="min-w-0 px-4 pb-4">
                  <div
                    className="overflow-x-auto"
                    role="region"
                    aria-label="Lista de clientes"
                    tabIndex={0}
                  >
                    <table className="min-w-[850px] text-left">
                      <caption className="sr-only">Clientes cadastrados</caption>
                      <thead>
                        <tr>
                          {[
                            "Cliente",
                            "Contato",
                            "Último atendimento",
                            "Próximo horário",
                            "Status",
                            "Ações",
                          ].map((c) => (
                            <th scope="col" key={c}>
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {consulta.data.data.map((c) => (
                          <tr key={c.id}>
                            <td>
                              <div className="flex items-center gap-2">
                                <span
                                  aria-hidden="true"
                                  className="grid size-9 shrink-0 place-items-center rounded-full bg-background font-semibold text-primary"
                                >
                                  {c.nome
                                    .split(" ")
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join("")}
                                </span>
                                <span className="min-w-32 max-w-56 font-semibold">
                                  {c.nome || "—"}
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className="min-w-40 max-w-64">
                                {c.telefone || "—"}
                                <span className="block">{c.email || "—"}</span>
                              </div>
                            </td>
                            <td>{data(c.ultimoAtendimento)}</td>
                            <td>{data(c.proximoHorario)}</td>
                            <td>
                              <BadgeStatus
                                negativo={c.status === "BLOQUEADO"}
                                alerta={c.status === "INATIVO"}
                              >
                                {c.status === "ATIVO"
                                  ? "Ativo"
                                  : c.status === "INATIVO"
                                    ? "Inativo"
                                    : "Bloqueado"}
                              </BadgeStatus>
                            </td>
                            <td>
                              <div className="flex items-center gap-2">
                                <button
                                  className={estiloBotao}
                                  aria-label={`Visualizar ${c.nome}`}
                                  disabled={abrir.isPending}
                                  onClick={() =>
                                    abrir.mutate({ id: c.id, leitura: true })
                                  }
                                >
                                  Visualizar
                                </button>
                                <button
                                  className={estiloBotao}
                                  aria-label={`Editar ${c.nome}`}
                                  disabled={abrir.isPending}
                                  onClick={() =>
                                    abrir.mutate({ id: c.id, leitura: false })
                                  }
                                >
                                  Editar
                                </button>
                                <button
                                  className={`${estiloBotao} text-danger`}
                                  aria-label={`Excluir ${c.nome}`}
                                  onClick={() => {
                                    remover.reset();
                                    setExcluir(c.id);
                                  }}
                                >
                                  <svg
                                    aria-hidden="true"
                                    width="18"
                                    height="18"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    viewBox="0 0 24 24"
                                  >
                                    <path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" />
                                  </svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {!consulta.data.data.length && (
                    <p className="py-10 text-center text-sm">
                      Nenhum cliente encontrado.
                    </p>
                  )}
                </div>
                <PaginacaoCatalogo
                  pagina={consulta.data.meta.pagina}
                  bloqueada={consulta.isFetching || consulta.isError || consulta.isPlaceholderData}
                  totalPaginas={consulta.data.meta.totalPaginas}
                  total={consulta.data.meta.total}
                  entidade="clientes"
                  mudar={setPagina}
                />
              </>
            )}
          </ResultadosListagem>
        </PainelCatalogo>
      )}
    </DashboardLayout>
  );
}
