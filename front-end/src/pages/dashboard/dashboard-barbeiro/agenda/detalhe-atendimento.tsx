import { useState } from "react";
import { Button } from "@heroui/react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "react-router-dom";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  Cartao,
} from "../../components/dashboard-compartilhado";
import { nomeStatus } from "../../components/dashboard-formatadores";
import { moeda } from "../../../agendamento/formatadores";
import { ResumoAgendamento } from "../../../agendamento/components/resumo-agendamento";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { MENU_BARBEIRO } from "../menu-barbeiro";
import type { AgendamentoControllerListarParams } from "../../../../api/models";
import {
  alterarStatus,
  buscarAtendimento,
} from "./services/agenda-barbeiro-api";
export function DetalheAtendimento() {
  const { usuario } = useAutenticacao();
  const { id } = useParams();
  const location = useLocation();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_PROPRIA_AGENDA");
  const consulta = useQuery({
    queryKey: ["atendimento", usuario?.id, Number(id)],
    queryFn: ({ signal }) => buscarAtendimento(Number(id), signal),
    enabled: permitido && Number.isInteger(Number(id)) && Number(id) > 0,
    retry: false,
  });
  const cache = useQueryClient();
  const [acao, setAcao] = useState<NonNullable<
    AgendamentoControllerListarParams["status"]
  > | null>(null);
  const [motivo, setMotivo] = useState("");
  const mutacao = useMutation({
    mutationFn: () => alterarStatus(Number(id), acao!, motivo.trim()),
    onSuccess: async () => {
      setAcao(null);
      setMotivo("");
      await Promise.all(
        ["dashboard", "agenda-barbeiro", "atendimento", "barbeiro"].map(
          (chave) => cache.invalidateQueries({ queryKey: [chave] }),
        ),
      );
    },
    onError: () => {
      void consulta.refetch();
    },
  });
  const transicoes: Record<
    string,
    NonNullable<AgendamentoControllerListarParams["status"]>[]
  > = {
    PENDENTE: ["CONFIRMADO", "CANCELADO"],
    CONFIRMADO: ["EM_ATENDIMENTO", "CANCELADO", "NAO_COMPARECEU"],
    EM_ATENDIMENTO: ["CONCLUIDO"],
  };
  const rotulos: Record<string, string> = {
    CONFIRMADO: "Confirmar atendimento",
    CANCELADO: "Cancelar atendimento",
    EM_ATENDIMENTO: "Iniciar atendimento",
    NAO_COMPARECEU: "Registrar não comparecimento",
    CONCLUIDO: "Concluir atendimento",
  };
  const retorno =
    typeof location.state?.retorno === "string" &&
    location.state.retorno.startsWith("/barbeiro/")
      ? location.state.retorno
      : "/barbeiro/agenda";
  return (
    <DashboardLayout
      fusoHorario="America/Sao_Paulo"
      titulo={`Atendimento #${id}`}
      subtitulo="Detalhes do agendamento"
      itens={MENU_BARBEIRO}
    >
      <Link to={retorno} className="mb-5 inline-block text-primary underline">
        Voltar à lista
      </Link>
      {!Number.isSafeInteger(Number(id)) || Number(id) <= 0 ? (
        <p role="alert">Atendimento inválido.</p>
      ) : !permitido ? (
        <p role="alert">
          Você não possui permissão para consultar a própria agenda.
        </p>
      ) : (
        <EstadoConsulta
          carregando={consulta.isPending}
          erro={consulta.error}
          vazio={!consulta.data}
          tentar={() => void consulta.refetch()}
        >
          {consulta.data && (
            <Cartao
              titulo={`${consulta.data.cliente.nome} · ${nomeStatus(consulta.data.status)}`}
            >
              <ResumoAgendamento item={consulta.data} />
              <ul className="mt-5 divide-y divide-border">
                {consulta.data.servicos.map((s) => (
                  <li key={s.idServico} className="py-3 text-sm">
                    {s.servico.nome} · {s.quantidade}×{" "}
                    {moeda(Number(s.precoAplicado))} ·{" "}
                    {s.duracaoAplicadaMinutos} min por unidade · Subtotal{" "}
                    {moeda(Number(s.subtotal))}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
                {(transicoes[consulta.data.status] ?? []).map((status) => (
                  <Button
                    key={status}
                    variant={status === "CANCELADO" ? "secondary" : "primary"}
                    isDisabled={mutacao.isPending}
                    onPress={() => {
                      setAcao(status);
                      mutacao.reset();
                    }}
                  >
                    {rotulos[status]}
                  </Button>
                ))}
              </div>
              {acao && (
                <form
                  aria-label="Confirmar alteração de status"
                  className="mt-4 rounded-xl border border-border bg-background p-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutacao.mutate();
                  }}
                >
                  <p className="font-semibold">{rotulos[acao]}?</p>
                  <p className="my-2 text-sm">
                    Confirme a alteração deste atendimento.
                  </p>
                  {acao === "CANCELADO" && (
                    <label className="block text-sm">
                      Motivo do cancelamento
                      <textarea
                        autoFocus
                        required
                        maxLength={1000}
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="my-2 block w-full rounded-lg border border-border bg-surface p-2 focus-visible:outline-primary"
                      />
                    </label>
                  )}
                  <div className="flex gap-2">
                    <Button
                      type="submit"
                      isDisabled={
                        mutacao.isPending ||
                        (acao === "CANCELADO" && !motivo.trim())
                      }
                    >
                      {mutacao.isPending ? "Salvando…" : "Confirmar alteração"}
                    </Button>
                    <Button
                      variant="secondary"
                      isDisabled={mutacao.isPending}
                      onPress={() => setAcao(null)}
                    >
                      Voltar
                    </Button>
                  </div>
                </form>
              )}
              {mutacao.isError && (
                <p role="alert" className="mt-3 text-danger">
                  Não foi possível alterar o atendimento. Confira o estado
                  atualizado e tente novamente.
                </p>
              )}
              {consulta.data.motivoCancelamento && (
                <p>
                  Motivo do cancelamento: {consulta.data.motivoCancelamento}
                </p>
              )}
            </Cartao>
          )}
        </EstadoConsulta>
      )}
    </DashboardLayout>
  );
}
