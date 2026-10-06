import { Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
  Kpi,
} from "../../components/dashboard-compartilhado";
import { moeda } from "../../components/dashboard-formatadores";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
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
  listarBarbeiros,
  buscarBarbeiro,
  salvarBarbeiro,
  excluirBarbeiro,
  todasFiliais,
} from "../services/cadastros-api";
import { texto } from "../services/operacoes-api";
export function BarbeirosIntegrados() {
  const { usuario } = useAutenticacao();
  const [params] = useSearchParams();
  const [id, definirId] = useState<number | null>(
    () => Number(params.get("detalhe")) || null,
  );
  const [pagina, mudar] = useState(1);
  const [filtros, definirFiltros] = useState({ busca: "", status: "" });
  const [modo, definirModo] = useState<"novo" | "editar" | "excluir" | null>(
    null,
  );
  const cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const podeFiliais = !!usuario?.permissoes.includes("GERENCIAR_FILIAIS");
  const lista = useQuery({
    queryKey: ["admin-barbeiros", usuario?.id, pagina, filtros],
    queryFn: ({ signal }) => listarBarbeiros({ pagina, ...filtros }, signal),
    enabled: permitido,
    retry: false,
  });
  const detalhe = useQuery({
    queryKey: ["admin-barbeiro", usuario?.id, id],
    queryFn: ({ signal }) => buscarBarbeiro(id!, signal),
    enabled: permitido && id !== null,
    retry: false,
  });
  const filiais = useQuery({
    queryKey: ["admin-filiais", usuario?.id, "seletor"],
    queryFn: ({ signal }) => todasFiliais(signal),
    enabled: permitido && podeFiliais && modo === "novo",
    retry: false,
  });
  async function salvo() {
    definirModo(null);
    definirId(null);
    await Promise.all(
      [
        "admin-barbeiros",
        "admin-barbeiro",
        "filial-equipe",
        "dashboard",
        "agendar",
      ].map((key) => cache.invalidateQueries({ queryKey: [key] })),
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
    ...(modo === "novo"
      ? [
          {
            nome: "idFilial",
            rotulo: "Filial",
            tipo: "number" as const,
            obrigatorio: true,
          },
        ]
      : []),
    { nome: "nomeProfissional", rotulo: "Nome profissional" },
    { nome: "descricao", rotulo: "Descrição", tipo: "textarea" },
    { nome: "fotoUrl", rotulo: "URL da foto" },
    { nome: "dataAdmissao", rotulo: "Data de admissão", tipo: "date" },
    {
      nome: "statusProfissional",
      rotulo: "Situação profissional",
      tipo: "select",
      obrigatorio: true,
      opcoes: ["ATIVO", "INATIVO", "AFASTADO"].map((valor) => ({
        valor,
        rotulo: valor,
      })),
    },
  ];
  const filialCampo: CampoCadastro = {
    nome: "idFilial",
    rotulo: "Filial",
    tipo: "select",
    obrigatorio: true,
    opcoes: filiais.data
      ?.filter((f) => f.status === "ATIVA")
      .map((f) => ({ valor: String(f.id), rotulo: texto(f.nome) })),
  };
  return (
    <DashboardLayout
      titulo="Barbeiros"
      subtitulo="Cadastro profissional e vínculo com filial"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para gerenciar usuários.</p>
      ) : (
        <>
          {lista.data && (
            <div className="mb-5 grid gap-3 sm:grid-cols-3">
              <Kpi
                rotulo="Profissionais ativos"
                valor={String(lista.data.indicadores?.ativos)}
                detalhe="Situação profissional"
                icone="usuarios"
              />
              <Kpi
                rotulo="Atendimentos no mês"
                valor={String(lista.data.indicadores?.atendimentosMes)}
                detalhe="Dados reais"
                icone="agenda"
              />
              <Kpi
                rotulo="Comissões a pagar"
                valor={moeda.format(
                  Number(lista.data.indicadores?.comissoesAPagar),
                )}
                detalhe="Comissões cadastradas"
                icone="financeiro"
              />
            </div>
          )}
          <Button
            className="mb-4"
            isDisabled={!podeFiliais}
            onPress={() => {
              definirId(null);
              definirModo("novo");
            }}
          >
            Novo barbeiro
          </Button>
          {!podeFiliais && (
            <p className="mb-3 text-sm text-muted">
              Cadastro exige autorização para selecionar a filial.
            </p>
          )}
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
              Busca
              <input
                name="busca"
                className="block rounded-lg border border-border bg-surface p-2"
              />
            </label>
            <label>
              Situação profissional
              <select
                name="status"
                className="block rounded-lg border border-border bg-surface p-2"
              >
                <option value="">Todas</option>
                {["ATIVO", "INATIVO", "AFASTADO"].map((s) => (
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
                    {texto(item.filial)} · {texto(item.status)}
                  </p>
                  <p className="my-3 text-sm">
                    {String(item.atendimentosHoje)} atendimentos hoje · Receita
                    mensal {moeda.format(Number(item.receitaMes))}
                  </p>
                  <Button
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
            titulo={`Barbeiro #${id}`}
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
                    <div>
                      <dt>Filial atual</dt>
                      <dd>#{String(detalhe.data.idFilial)}</dd>
                    </div>
                  </dl>
                  <p className="my-3 text-sm text-muted">
                    Transferência de filial aguarda definição da política para
                    agenda futura (D03). Agendamentos anteriores não são
                    migrados automaticamente.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="secondary"
                      onPress={() => definirModo("editar")}
                    >
                      Editar / situação profissional
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => definirModo("excluir")}
                    >
                      Excluir
                    </Button>
                  </div>
                </>
              )}
            </EstadoConsulta>
          </DialogoOperacao>
          {modo === "novo" && (
            <Button variant="secondary" onPress={() => definirModo(null)}>
              Cancelar cadastro
            </Button>
          )}
          {modo === "novo" && (
            <EstadoConsulta
              carregando={filiais.isPending}
              erro={filiais.error}
              vazio={!filiais.data?.some((f) => f.status === "ATIVA")}
              tentar={() => void filiais.refetch()}
            >
              {filiais.data?.some((f) => f.status === "ATIVA") && (
                <FormularioCadastro
                  titulo="Novo barbeiro"
                  campos={campos.map((c) =>
                    c.nome === "idFilial" ? filialCampo : c,
                  )}
                  inicial={{ statusProfissional: "ATIVO" }}
                  salvar={(dados) =>
                    salvarBarbeiro(null, {
                      ...dados,
                      idFilial: Number(dados.idFilial),
                    })
                  }
                  salvo={salvo}
                  fechar={() => definirModo(null)}
                />
              )}
            </EstadoConsulta>
          )}
          {modo === "editar" && detalhe.data && (
            <FormularioCadastro
              titulo="Editar barbeiro"
              campos={campos}
              inicial={detalhe.data}
              confirmacao="Salvar cadastro e situação profissional? A filial atual permanece vinculada."
              salvar={(dados) => salvarBarbeiro(id, dados)}
              salvo={salvo}
              fechar={() => definirModo(null)}
            />
          )}
          {modo === "excluir" && id !== null && detalhe.data && (
            <ConfirmarExclusao
              nome={texto(detalhe.data.nome)}
              excluir={() => excluirBarbeiro(id)}
              salvo={salvo}
              fechar={() => definirModo(null)}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
