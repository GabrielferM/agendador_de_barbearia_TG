import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { ComissaoExtratoDto } from "../../../api/models";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import {
  Cartao,
  EstadoCarregamento,
  EstadoErro,
  Kpi,
} from "../components/dashboard-compartilhado";
import { moeda, nomeStatus } from "../components/dashboard-formatadores";
import {
  estiloBotao,
  estiloCampo,
} from "../dashboard-administrador/components/formulario-cadastro";
import { ControlesPeriodo } from "../dashboard-administrador/financeiro/components/controles-periodo";
import {
  consultarExtrato,
  periodoFinanceiroAtual,
  registrarRepasse,
} from "./financeiro-api";

const dataRepasse = new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo",
  dateStyle: "short",
});

type Periodo = ReturnType<typeof periodoFinanceiroAtual>;

export function PaginacaoFinanceira({
  pagina,
  total,
  alterar,
}: {
  pagina: number;
  total: number;
  alterar: (pagina: number) => void;
}) {
  if (total <= 1) return null;
  return (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        className={estiloBotao}
        disabled={pagina <= 1}
        onClick={() => alterar(pagina - 1)}
      >
        Anterior
      </button>
      <span>
        Página {pagina} de {total}
      </span>
      <button
        type="button"
        className={estiloBotao}
        disabled={pagina >= total}
        onClick={() => alterar(pagina + 1)}
      >
        Próxima
      </button>
    </div>
  );
}

export function ComissoesPainel({
  admin = false,
  compacto = false,
  periodo: periodoExterno,
}: {
  admin?: boolean;
  compacto?: boolean;
  periodo?: Periodo;
}) {
  const { usuario } = useAutenticacao();
  const permitido = admin
    ? usuario?.papel === "ADMINISTRADOR" &&
      usuario.permissoes.includes("GERENCIAR_COMISSOES")
    : usuario?.papel === "BARBEIRO" &&
      usuario.permissoes.includes("GERENCIAR_PROPRIA_AGENDA");
  const [periodoLocal, definirPeriodo] = useState(periodoFinanceiroAtual);
  const periodo = periodoExterno ?? periodoLocal;
  const [paginacao, definirPaginacao] = useState({ periodo, pagina: 1 });
  const pagina =
    paginacao.periodo.inicioDe === periodo.inicioDe &&
    paginacao.periodo.inicioAte === periodo.inicioAte
      ? paginacao.pagina
      : 1;
  const [selecionada, selecionar] = useState<ComissaoExtratoDto | null>(null);
  const [mensagem, definirMensagem] = useState("");
  const cache = useQueryClient();
  const consulta = useQuery({
    queryKey: ["financeiro", usuario?.id, admin, periodo, pagina, compacto],
    enabled: permitido,
    retry: false,
    queryFn: ({ signal }) =>
      consultarExtrato(
        admin,
        { ...periodo, pagina, limite: compacto ? 1 : 10 },
        signal,
      ),
  });
  const repasse = useMutation({
    mutationFn: registrarRepasse,
    onSuccess: async () => {
      selecionar(null);
      definirMensagem("Repasse registrado.");
      await Promise.all([
        cache.invalidateQueries({ queryKey: ["financeiro"] }),
        cache.invalidateQueries({
          queryKey: ["admin", usuario?.id, "financeiro"],
        }),
        cache.invalidateQueries({
          queryKey: ["admin", usuario?.id, "barbeiros"],
        }),
      ]);
    },
  });
  if (!permitido) return null;
  return (
    <div className="my-4">
      <Cartao titulo={admin ? "Comissões da equipe" : "Minhas comissões"}>
        {!compacto && !periodoExterno && (
          <ControlesPeriodo
            inicial={periodo}
            aplicar={(novo) => {
              definirPeriodo(novo);
              definirPaginacao({ periodo: novo, pagina: 1 });
            }}
            estiloBotao={estiloBotao}
            estiloCampo={estiloCampo}
          />
        )}
        {consulta.isPending ? (
          <EstadoCarregamento />
        ) : consulta.isError ? (
          <EstadoErro
            mensagem={consulta.error.message}
            tentarNovamente={() => void consulta.refetch()}
          />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi
                rotulo={admin ? "Comissões a pagar" : "Comissões a receber"}
                valor={moeda.format(Number(consulta.data.aReceber))}
                detalhe="Todos os períodos"
                icone="financeiro"
              />
              <Kpi
                rotulo="Comissões geradas"
                valor={moeda.format(Number(consulta.data.geradasNoPeriodo))}
                detalhe={
                  compacto ? "Neste mês" : "Pela data de geração no período"
                }
                icone="financeiro"
              />
              <Kpi
                rotulo="Repasses pagos"
                valor={moeda.format(Number(consulta.data.pagasNoPeriodo))}
                detalhe={
                  compacto ? "Neste mês" : "Pela data de pagamento no período"
                }
                icone="financeiro"
              />
            </div>
            {compacto ? (
              <Link
                className="mt-4 inline-block text-sm text-primary underline"
                to="/admin/financeiro"
              >
                Abrir financeiro
              </Link>
            ) : (
              <>
                <h3 className="mb-2 mt-5 font-semibold">
                  Extrato por data de geração
                </h3>
                {consulta.data.itens.length === 0 ? (
                  <p>Nenhuma comissão neste período.</p>
                ) : (
                  <div
                    className="overflow-x-auto"
                    tabIndex={0}
                    role="region"
                    aria-label="Extrato de comissões"
                  >
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="p-2" scope="col">
                            Serviço
                          </th>
                          {admin && (
                            <th className="p-2" scope="col">
                              Barbeiro
                            </th>
                          )}
                          <th className="p-2" scope="col">
                            Gerada em
                          </th>
                          <th className="p-2" scope="col">
                            Base
                          </th>
                          <th className="p-2" scope="col">
                            Taxa
                          </th>
                          <th className="p-2" scope="col">
                            Comissão
                          </th>
                          <th className="p-2" scope="col">
                            Status
                          </th>
                          <th className="p-2" scope="col">
                            Paga em
                          </th>
                          {admin && (
                            <th className="p-2" scope="col">
                              Repasse
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {consulta.data.itens.map((item) => (
                          <tr key={item.id} className="border-b border-border">
                            <td className="p-2">{item.servico}</td>
                            {admin && <td className="p-2">{item.barbeiro}</td>}
                            <td className="whitespace-nowrap p-2">
                              {dataRepasse.format(new Date(item.dataGeracao))}
                            </td>
                            <td className="whitespace-nowrap p-2">
                              {moeda.format(Number(item.baseCalculo))}
                            </td>
                            <td className="whitespace-nowrap p-2">
                              {Number(item.percentualAplicado).toLocaleString(
                                "pt-BR",
                              )}
                              %
                            </td>
                            <td className="whitespace-nowrap p-2">
                              {moeda.format(Number(item.valorComissao))}
                            </td>
                            <td className="p-2">{nomeStatus(item.status)}</td>
                            <td className="whitespace-nowrap p-2">
                              {item.dataPagamento
                                ? dataRepasse.format(
                                    new Date(item.dataPagamento),
                                  )
                                : "—"}
                            </td>
                            {admin && (
                              <td className="p-2">
                                {item.status === "LIBERADA" && (
                                  <button
                                    type="button"
                                    className={estiloBotao}
                                    disabled={
                                      !!selecionada || repasse.isPending
                                    }
                                    onClick={() => {
                                      repasse.reset();
                                      definirMensagem("");
                                      selecionar(item);
                                    }}
                                  >
                                    Registrar repasse
                                  </button>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                <PaginacaoFinanceira
                  pagina={pagina}
                  total={consulta.data.totalPaginas}
                  alterar={(novaPagina) =>
                    definirPaginacao({ periodo, pagina: novaPagina })
                  }
                />
              </>
            )}
          </>
        )}
        {selecionada && (
          <fieldset
            className="mt-4 rounded-lg border border-border p-3"
            disabled={repasse.isPending}
          >
            <legend className="font-semibold">
              Confirmar repasse já efetuado
            </legend>
            <p>
              {selecionada.barbeiro} · {selecionada.servico} ·{" "}
              {moeda.format(Number(selecionada.valorComissao))}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                className={estiloBotao}
                onClick={() => selecionar(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={estiloBotao}
                onClick={() => repasse.mutate(selecionada.id)}
              >
                {repasse.isPending ? "Registrando…" : "Confirmar registro"}
              </button>
            </div>
            {repasse.isError && (
              <p role="alert" className="mt-2 text-danger">
                {repasse.error.message}
              </p>
            )}
          </fieldset>
        )}
        {mensagem && (
          <p role="status" className="mt-3 text-success">
            {mensagem}
          </p>
        )}
      </Cartao>
    </div>
  );
}
