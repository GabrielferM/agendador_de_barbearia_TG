import { Button } from "@heroui/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { FilialControllerListarParams } from "../../../../api/models";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
} from "../../components/dashboard-compartilhado";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import {
  FormularioCadastro,
  type CampoCadastro,
} from "../components/formulario-cadastro";
import {
  DialogoOperacao,
  PaginacaoCadastros,
} from "../components/dialogo-operacao";
import {
  listarFiliais,
  buscarFilial,
  listarEquipe,
  salvarFilial,
} from "../services/cadastros-api";
import { objeto, texto, type Registro } from "../services/operacoes-api";
const campos: CampoCadastro[] = [
  { nome: "nome", rotulo: "Nome", obrigatorio: true },
  { nome: "cnpj", rotulo: "CNPJ", obrigatorio: true },
  { nome: "telefone", rotulo: "Telefone" },
  { nome: "email", rotulo: "E-mail", tipo: "email" },
  ...[
    "cep",
    "logradouro",
    "numero",
    "complemento",
    "bairro",
    "cidade",
    "estado",
  ].map((nome) => ({
    nome: `endereco.${nome}`,
    rotulo:
      nome === "numero"
        ? "Número"
        : nome === "cep"
          ? "CEP"
          : nome[0].toUpperCase() + nome.slice(1),
    obrigatorio: nome !== "complemento",
    minimo: nome === "estado" ? 2 : undefined,
    maximo: nome === "estado" ? 2 : nome === "cep" ? 9 : undefined,
  })),
];
const situacoes = ["ATIVA", "INATIVA", "EM_MANUTENCAO"];
function EquipeFilial({ id }: { id: number }) {
  const { usuario } = useAutenticacao();
  const [pagina, mudar] = useState(1);
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const consulta = useQuery({
    queryKey: ["filial-equipe", usuario?.id, id, pagina],
    queryFn: ({ signal }) => listarEquipe(id, pagina, signal),
    enabled: permitido,
    retry: false,
  });
  return (
    <section className="mt-5">
      <h3 className="font-semibold">Profissionais vinculados</h3>
      {!permitido ? (
        <p>Você não possui autorização para consultar a equipe.</p>
      ) : (
        <>
          <EstadoConsulta
            carregando={consulta.isPending}
            erro={consulta.error}
            vazio={!consulta.data?.data.length}
            tentar={() => void consulta.refetch()}
          >
            <ul>
              {consulta.data?.data.map((item) => (
                <li key={Number(item.id)} className="py-2">
                  {objeto(item.usuario) ? texto(item.usuario.nome) : ""} ·{" "}
                  {texto(item.statusProfissional)}{" "}
                  <Link
                    to={`/admin/barbeiros?detalhe=${item.id}`}
                    className="text-primary underline"
                  >
                    Ver barbeiro
                  </Link>
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
export function FiliaisAdministrador() {
  const { usuario } = useAutenticacao();
  const { id: idRota } = useParams();
  const id = idRota ? Number(idRota) : null;
  const navigate = useNavigate();
  const [pagina, mudar] = useState(1);
  const [status, definirStatus] = useState("");
  const [modo, definirModo] = useState<"novo" | "editar" | null>(null);
  const cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_FILIAIS");
  const lista = useQuery({
    queryKey: ["admin-filiais", usuario?.id, pagina, status],
    queryFn: ({ signal }) =>
      listarFiliais(
        {
          pagina,
          limite: 10,
          status: status
            ? (status as FilialControllerListarParams["status"])
            : undefined,
        },
        signal,
      ),
    enabled: permitido,
    retry: false,
  });
  const detalhe = useQuery({
    queryKey: ["admin-filial", usuario?.id, id],
    queryFn: ({ signal }) => buscarFilial(id!, signal),
    enabled: permitido && id !== null,
    retry: false,
  });
  async function salvo() {
    definirModo(null);
    await Promise.all(
      [
        "admin-filiais",
        "admin-filial",
        "admin-barbeiros",
        "filial-equipe",
        "agendar",
      ].map((key) => cache.invalidateQueries({ queryKey: [key] })),
    );
  }
  const inicial: Registro = { ...detalhe.data };
  if (objeto(detalhe.data?.endereco))
    Object.entries(detalhe.data.endereco).forEach(([chave, valor]) => {
      inicial[`endereco.${chave}`] = valor;
    });
  return (
    <DashboardLayout
      titulo="Filiais"
      subtitulo="Unidades, endereço e equipe"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para gerenciar filiais.</p>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap items-end gap-3">
            <Button onPress={() => definirModo("novo")}>Nova filial</Button>
            <label>
              Situação
              <select
                value={status}
                onChange={(e) => {
                  definirStatus(e.target.value);
                  mudar(1);
                }}
                className="ml-2 rounded-lg border border-border bg-surface p-2"
              >
                <option value="">Todas</option>
                {situacoes.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <EstadoConsulta
            carregando={lista.isPending}
            erro={lista.error}
            vazio={!lista.data?.data.length}
            tentar={() => void lista.refetch()}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {lista.data?.data.map((item) => (
                <Cartao key={Number(item.id)} titulo={texto(item.nome)}>
                  <p>
                    {texto(item.status)} · CNPJ {texto(item.cnpj)}
                  </p>
                  <Link
                    className="mt-3 inline-block text-primary underline"
                    to={`/admin/filiais/${item.id}`}
                  >
                    Visualizar filial #{String(item.id)}
                  </Link>
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
            titulo={`Filial #${id}`}
            aberto={id !== null && modo === null}
            fechar={() => navigate("/admin/filiais")}
          >
            <EstadoConsulta
              carregando={detalhe.isPending}
              erro={detalhe.error}
              vazio={!detalhe.data}
              tentar={() => void detalhe.refetch()}
            >
              {detalhe.data && (
                <>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {campos.map((campo) => (
                      <div key={campo.nome}>
                        <dt className="text-muted">{campo.rotulo}</dt>
                        <dd>{texto(inicial[campo.nome]) || "Não informado"}</dd>
                      </div>
                    ))}
                    <div>
                      <dt>Situação</dt>
                      <dd>{texto(detalhe.data.status)}</dd>
                    </div>
                  </dl>
                  <Button
                    className="mt-4"
                    variant="secondary"
                    onPress={() => definirModo("editar")}
                  >
                    Editar / alterar situação
                  </Button>
                  <EquipeFilial key={id} id={id!} />
                </>
              )}
            </EstadoConsulta>
          </DialogoOperacao>
          {(modo === "novo" || (modo === "editar" && detalhe.data)) && (
            <FormularioCadastro
              titulo={modo === "novo" ? "Nova filial" : "Editar filial"}
              campos={[
                ...campos,
                ...(modo === "editar"
                  ? [
                      {
                        nome: "status",
                        rotulo: "Situação",
                        tipo: "select" as const,
                        obrigatorio: true,
                        opcoes: situacoes.map((valor) => ({
                          valor,
                          rotulo: valor,
                        })),
                      },
                    ]
                  : []),
              ]}
              inicial={modo === "editar" ? inicial : {}}
              confirmacao="Salvar filial? Alterar situação afeta novas reservas, preservando histórico e atendimentos existentes."
              salvar={(dados) =>
                salvarFilial(modo === "novo" ? null : id, dados)
              }
              salvo={salvo}
              fechar={() => definirModo(null)}
            />
          )}
        </>
      )}
    </DashboardLayout>
  );
}
