import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  PainelCatalogo,
  PaginacaoCatalogo,
} from "../components/painel-catalogo";
import { BadgeStatus } from "../components/componentes-administrativos";
import {
  buscarFilial,
  consultarFiliais,
  salvarFilial,
  STATUS_FILIAIS,
  valoresFilial,
} from "./services/filiais-api";
import type { StatusFilial } from "./services/filiais-api";

const campos: CampoCadastro[] = [
  { nome: "nome", rotulo: "Nome", obrigatorio: true },
  { nome: "cnpj", rotulo: "CNPJ", obrigatorio: true },
  { nome: "telefone", rotulo: "Telefone" },
  { nome: "email", rotulo: "E-mail", tipo: "email" },
  { nome: "cep", rotulo: "CEP", obrigatorio: true },
  { nome: "logradouro", rotulo: "Logradouro", obrigatorio: true },
  { nome: "numero", rotulo: "Número", obrigatorio: true },
  { nome: "complemento", rotulo: "Complemento" },
  { nome: "bairro", rotulo: "Bairro", obrigatorio: true },
  { nome: "cidade", rotulo: "Cidade", obrigatorio: true },
  { nome: "estado", rotulo: "UF", obrigatorio: true },
];

function EditorFilial({
  id,
  valores,
  pendente,
  erro,
  salvar,
  fechar,
}: {
  id: number | null;
  valores: Record<string, string>;
  pendente: boolean;
  erro?: string;
  salvar: (dados: Record<string, string>) => void;
  fechar: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.querySelector("input")?.focus();
  }, []);
  return (
    <div ref={ref} className="px-4">
      <h2 className="font-semibold">
        {id === null ? "Nova filial" : "Editar filial"}
      </h2>
      <FormularioCadastro
        campos={
          id === null
            ? campos
            : [
                ...campos,
                {
                  nome: "status",
                  rotulo: "Status da filial",
                  obrigatorio: true,
                  descricao:
                    "Inativa e Em manutenção suspendem novas reservas sem cancelar os agendamentos existentes.",
                  opcoes: Object.entries(STATUS_FILIAIS).map(
                    ([valor, rotulo]) => ({ valor, rotulo }),
                  ),
                },
              ]
        }
        valores={valores}
        pendente={pendente}
        erro={erro}
        salvar={salvar}
        fechar={fechar}
      />
    </div>
  );
}

export function FiliaisAdministrador() {
  const { usuario } = useAutenticacao(),
    cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_FILIAIS");
  const [status, setStatus] = useState<StatusFilial | "">("");
  const [pagina, setPagina] = useState(1);
  const [editor, setEditor] = useState<{ id: number | null } | null>(null);
  const [aviso, setAviso] = useState("");
  const novo = useRef<HTMLButtonElement>(null);
  const editorAnterior = useRef(false);
  useEffect(() => {
    if (!editor && editorAnterior.current) novo.current?.focus();
    editorAnterior.current = !!editor;
  }, [editor]);
  const consulta = useQuery({
    queryKey: ["admin", usuario?.id, "filiais", status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) => consultarFiliais(status, pagina, signal),
    staleTime: 60_000,
  });
  const detalhe = useQuery({
    queryKey: ["admin", usuario?.id, "filial", editor?.id],
    enabled: permitido && editor?.id != null,
    queryFn: ({ signal }) => buscarFilial(editor!.id!, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const fechar = () => {
    setEditor(null);
  };
  const gravar = useMutation({
    mutationFn: ({
      id,
      dados,
    }: {
      id: number | null;
      dados: Record<string, string>;
    }) => salvarFilial(id, dados),
    retry: false,
    onSuccess: async (_, { id }) => {
      fechar();
      setAviso(id === null ? "Filial cadastrada." : "Filial atualizada.");
      setPagina(1);
      await Promise.all([
        cache.invalidateQueries({
          queryKey: ["admin", usuario?.id, "filiais"],
        }),
        cache.invalidateQueries({ queryKey: ["admin", usuario?.id, "filial"] }),
        cache.invalidateQueries({
          queryKey: ["admin", usuario?.id, "barbeiros"],
        }),
        cache.invalidateQueries({
          queryKey: ["admin", usuario?.id, "filiais-cadastro-barbeiro"],
        }),
        cache.invalidateQueries({ queryKey: ["inicio", "barbeiros"] }),
        cache.invalidateQueries({ queryKey: ["agendar"] }),
      ]);
    },
  });
  const abrir = (id: number | null) => {
    gravar.reset();
    setAviso("");
    setEditor({ id });
  };
  return (
    <DashboardLayout
      titulo="Filiais"
      subtitulo="Cadastre e gerencie as unidades da barbearia"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para gerenciar filiais.</p>
      ) : (
        <PainelCatalogo>
          <div className="filtros-catalogo">
            <label>
              Status
              <select
                className={estiloCampo}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as StatusFilial | "");
                  setPagina(1);
                }}
              >
                <option value="">Todos</option>
                {Object.entries(STATUS_FILIAIS).map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </label>
            <button
              ref={novo}
              className={`${estiloBotao} bg-primary! text-white sm:ml-auto`}
              disabled={!!editor}
              onClick={() => abrir(null)}
            >
              Nova filial
            </button>
          </div>
          {aviso && (
            <p role="status" className="px-4 pb-4 text-success">
              {aviso}
            </p>
          )}
          {editor &&
            (editor.id !== null && (detalhe.isPending || detalhe.isFetching) ? (
              <div className="px-4 pb-4">
                <EstadoCarregamento />
                <button className={estiloBotao} onClick={fechar}>
                  Fechar
                </button>
              </div>
            ) : editor.id !== null && detalhe.isError ? (
              <div className="px-4">
                <EstadoErro
                  mensagem={detalhe.error.message}
                  tentarNovamente={() => void detalhe.refetch()}
                />
                <button className={estiloBotao} onClick={fechar}>
                  Fechar
                </button>
              </div>
            ) : (
              <EditorFilial
                key={editor.id ?? "nova"}
                id={editor.id}
                valores={editor.id === null ? {} : valoresFilial(detalhe.data!)}
                pendente={gravar.isPending}
                erro={gravar.error?.message}
                fechar={fechar}
                salvar={(dados) => {
                  if (!gravar.isPending)
                    gravar.mutate({ id: editor.id, dados });
                }}
              />
            ))}
          {consulta.isPending ? (
            <EstadoCarregamento />
          ) : consulta.isError ? (
            <EstadoErro
              mensagem={consulta.error.message}
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : (
            <>
              <div className="min-w-0 px-4 pb-4">
                {!consulta.data.data.length ? (
                  <p className="py-8 text-center">Nenhuma filial encontrada.</p>
                ) : (
                  <div
                    className="overflow-x-auto"
                    role="region"
                    aria-label="Lista de filiais"
                    tabIndex={0}
                  >
                    <table className="w-full min-w-[850px] text-left text-sm">
                      <caption className="sr-only">Filiais cadastradas</caption>
                      <thead>
                        <tr>
                          {[
                            "Nome",
                            "CNPJ",
                            "Contato",
                            "Endereço",
                            "Status",
                            "Ações",
                          ].map((coluna) => (
                            <th key={coluna} scope="col">
                              {coluna}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {consulta.data.data.map((filial) => (
                          <tr key={filial.id}>
                            <td className="max-w-56 break-words font-semibold">
                              {filial.nome}
                            </td>
                            <td>{filial.cnpj}</td>
                            <td className="max-w-64 break-words">
                              <span className="block">
                                {filial.telefone || "—"}
                              </span>
                              <span>{filial.email || "—"}</span>
                            </td>
                            <td className="max-w-72 break-words">
                              {filial.endereco.logradouro},{" "}
                              {filial.endereco.numero}
                              {filial.endereco.complemento
                                ? `, ${filial.endereco.complemento}`
                                : ""}
                              <span className="block">
                                {filial.endereco.bairro},{" "}
                                {filial.endereco.cidade}/
                                {filial.endereco.estado} · {filial.endereco.cep}
                              </span>
                            </td>
                            <td>
                              <BadgeStatus alerta={filial.status !== "ATIVA"}>
                                {STATUS_FILIAIS[filial.status]}
                              </BadgeStatus>
                            </td>
                            <td>
                              <button
                                className={estiloBotao}
                                aria-label={`Editar ${filial.nome}`}
                                disabled={!!editor}
                                onClick={() => abrir(filial.id)}
                              >
                                Editar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <PaginacaoCatalogo
                pagina={pagina}
                totalPaginas={consulta.data.meta.totalPaginas}
                total={consulta.data.meta.total}
                entidade="filiais"
                entidadeSingular="filial"
                mudar={setPagina}
              />
            </>
          )}
        </PainelCatalogo>
      )}
    </DashboardLayout>
  );
}
