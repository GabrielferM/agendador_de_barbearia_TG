import { Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
  Kpi,
} from "../../components/dashboard-compartilhado";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { dataHorario } from "../../../agendamento/formatadores";
import { listarAgendamentos } from "../../../agendamento/services/agendamento-api";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  FormularioCadastro,
  ConfirmarExclusao,
  type CampoCadastro,
} from "../components/formulario-cadastro";
import {
  DialogoOperacao,
  PaginacaoCadastros,
} from "../components/dialogo-operacao";
import {
  listarClientes,
  buscarCliente,
  salvarCliente,
  excluirCliente,
} from "../services/cadastros-api";
import { texto } from "../services/operacoes-api";
function AgendaCliente({ id }: { id: number }) {
  const { usuario } = useAutenticacao();
  const [pagina, mudar] = useState(1);
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_AGENDAMENTOS");
  const consulta = useQuery({
    queryKey: ["agenda-admin", usuario?.id, "cliente", id, pagina],
    queryFn: ({ signal }) =>
      listarAgendamentos(pagina, signal, { idCliente: id }),
    enabled: permitido,
    retry: false,
  });
  return (
    <section className="mt-5">
      <h3 className="font-semibold">Agendamentos do cliente</h3>
      {!permitido ? (
        <p>Você não possui permissão para consultar os agendamentos.</p>
      ) : (
        <>
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
                    to={`/admin/agendamentos?detalhe=${item.id}`}
                  >
                    #{item.id} · {dataHorario(item.inicioPrevisto)}
                  </Link>{" "}
                  · {item.status}
                </li>
              ))}
            </ul>
          </EstadoConsulta>
          {consulta.data && (
            <PaginacaoCadastros
              {...consulta.data.meta}
              pagina={pagina}
              mudar={mudar}
            />
          )}
        </>
      )}
    </section>
  );
}
export function ClientesIntegrados() {
  const { usuario } = useAutenticacao();
  const [id, definirId] = useState<number | null>(null);
  const [pagina, mudar] = useState(1);
  const [filtros, definirFiltros] = useState({ busca: "", status: "" });
  const [modo, definirModo] = useState<"novo" | "editar" | "excluir" | null>(
    null,
  );
  const cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const lista = useQuery({
    queryKey: ["admin-clientes", usuario?.id, pagina, filtros],
    queryFn: ({ signal }) => listarClientes({ pagina, ...filtros }, signal),
    enabled: permitido,
    retry: false,
  });
  const detalhe = useQuery({
    queryKey: ["admin-cliente", usuario?.id, id],
    queryFn: ({ signal }) => buscarCliente(id!, signal),
    enabled: permitido && id !== null,
    retry: false,
  });
  async function salvo() {
    definirModo(null);
    definirId(null);
    await Promise.all(
      ["admin-clientes", "admin-cliente", "dashboard", "agenda-admin"].map(
        (key) => cache.invalidateQueries({ queryKey: [key] }),
      ),
    );
  }
  const campos: CampoCadastro[] = [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, minimo: 2 },
    { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
    {
      nome: "senha",
      rotulo: modo === "novo" ? "Senha inicial" : "Nova senha (opcional)",
      tipo: "password",
      obrigatorio: modo === "novo",
    },
    { nome: "cpf", rotulo: "CPF", obrigatorio: true },
    { nome: "telefone", rotulo: "Telefone" },
    { nome: "dataNascimento", rotulo: "Data de nascimento", tipo: "date" },
    { nome: "observacao", rotulo: "Observação", tipo: "textarea" },
  ];
  return (
    <DashboardLayout
      titulo="Clientes"
      subtitulo="Cadastro e consulta de agendamentos"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para gerenciar usuários.</p>
      ) : (
        <>
          {lista.data && (
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              {[
                ["ativos", "Clientes ativos"],
                ["novosNoMes", "Novos no mês"],
                ["retornoAgendado", "Retorno agendado"],
              ].map(([campo, rotulo]) => (
                <Kpi
                  key={campo}
                  rotulo={rotulo}
                  valor={String(lista.data.indicadores?.[campo])}
                  detalhe="Dados reais"
                  icone="usuarios"
                />
              ))}
            </div>
          )}
          <Button
            className="mb-4"
            onPress={() => {
              definirId(null);
              definirModo("novo");
            }}
          >
            Novo cliente
          </Button>
          <form
            className="mb-5 flex flex-wrap items-end gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget);
              definirFiltros({
                busca: String(form.get("busca")),
                status: String(form.get("status")),
              });
              mudar(1);
            }}
          >
            <label>
              Nome, telefone ou e-mail
              <input
                name="busca"
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <label>
              Status do usuário
              <select
                name="status"
                className="block rounded-lg border border-border bg-surface p-2"
              >
                <option value="">Todos</option>
                {["ATIVO", "INATIVO", "BLOQUEADO"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <Button type="submit">Buscar</Button>
            <Button
              type="reset"
              variant="secondary"
              onPress={() => {
                definirFiltros({ busca: "", status: "" });
                mudar(1);
              }}
            >
              Limpar
            </Button>
          </form>
          <EstadoConsulta
            carregando={lista.isPending}
            erro={lista.error}
            vazio={!lista.data?.data.length}
            tentar={() => void lista.refetch()}
          >
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {lista.data?.data.map((item) => (
                <Cartao key={Number(item.id)} titulo={texto(item.nome)}>
                  <p>
                    {texto(item.email)} · {texto(item.telefone)}
                  </p>
                  <p className="my-3 text-sm">
                    Status do usuário: {texto(item.status)}
                  </p>
                  {!!item.proximoHorario && (
                    <p className="text-sm">
                      Próximo: {dataHorario(texto(item.proximoHorario))}
                    </p>
                  )}
                  <Button
                    className="mt-3"
                    variant="secondary"
                    onPress={() => definirId(Number(item.id))}
                  >
                    Visualizar #{String(item.id)}
                  </Button>
                </Cartao>
              ))}
            </div>
          </EstadoConsulta>
          {lista.data && (
            <PaginacaoCadastros
              {...lista.data.meta}
              pagina={pagina}
              mudar={mudar}
            />
          )}
          <DialogoOperacao
            titulo={`Cliente #${id}`}
            aberto={id !== null && modo === null}
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
                  <dl className="space-y-3">
                    {campos
                      .filter((c) => c.tipo !== "password")
                      .map((c) => (
                        <div key={c.nome}>
                          <dt className="text-muted">{c.rotulo}</dt>
                          <dd>
                            {texto(detalhe.data[c.nome]) || "Não informado"}
                          </dd>
                        </div>
                      ))}
                    <div>
                      <dt>Status do usuário (somente leitura)</dt>
                      <dd>{texto(detalhe.data.statusUsuario)}</dd>
                    </div>
                  </dl>
                  <div className="mt-4 flex gap-3">
                    <Button
                      variant="secondary"
                      onPress={() => definirModo("editar")}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => definirModo("excluir")}
                    >
                      Excluir
                    </Button>
                  </div>
                  <AgendaCliente key={id} id={id!} />
                </>
              )}
            </EstadoConsulta>
          </DialogoOperacao>
          {(modo === "novo" || (modo === "editar" && detalhe.data)) && (
            <FormularioCadastro
              titulo={modo === "novo" ? "Novo cliente" : "Editar cliente"}
              campos={campos}
              inicial={modo === "editar" ? detalhe.data : {}}
              salvar={(dados) =>
                salvarCliente(modo === "novo" ? null : id, dados)
              }
              salvo={salvo}
              fechar={() => definirModo(null)}
            />
          )}
          {modo === "excluir" && id !== null && detalhe.data && (
            <ConfirmarExclusao
              nome={texto(detalhe.data.nome)}
              excluir={() => excluirCliente(id)}
              salvo={salvo}
              fechar={() => definirModo(null)}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
