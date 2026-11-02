import { Button } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { AgendamentoRespostaDto } from "../../api/models";
import { useAutenticacao } from "../../auth/contexto-autenticacao";
import {
  cancelarAgendamento,
  listarAgendamentos,
  mensagemErro,
} from "../agendamento/services/agendamento-api";
import {
  ResumoAgendamento,
  DetalhesAgendamento,
} from "../agendamento/components/resumo-agendamento";
import { StatusAgendamento } from "../agendamento/components/status-agendamento";
import { dataHorario } from "../agendamento/formatadores";
import { dataJaPassou, organizarAgendamentos } from "./organizar-agendamentos";

const POR_PAGINA = 10;
export function MeusAgendamentos() {
  const { usuario, sair } = useAutenticacao();
  const [aba, definirAba] = useState<"proximos" | "historico">("proximos");
  const [pagina, definirPagina] = useState(1);
  const [cancelando, definirCancelando] =
    useState<AgendamentoRespostaDto | null>(null);
  const [motivo, definirMotivo] = useState("");
  const [aviso, definirAviso] = useState("");
  const [agora, definirAgora] = useState(() => Date.now());
  const dialogo = useRef<HTMLDialogElement>(null);
  const origemFoco = useRef<HTMLElement | null>(null);
  const titulo = useRef<HTMLHeadingElement>(null);
  const envioEmCurso = useRef(false);
  const queryClient = useQueryClient();
  const chave = ["meus-agendamentos", usuario?.id];
  const consulta = useQuery({
    queryKey: chave,
    queryFn: ({ signal }) => listarAgendamentos(signal),
    enabled: !!usuario,
    retry: false,
  });
  const cancelamento = useMutation({
    mutationFn: () => cancelarAgendamento(cancelando!.id, motivo.trim()),
    retry: false,
    onSuccess: async (atualizado) => {
      queryClient.setQueryData<AgendamentoRespostaDto[]>(chave, (itens) =>
        itens?.map((item) => (item.id === atualizado.id ? atualizado : item)),
      );
      definirCancelando(null);
      definirMotivo("");
      definirAviso("Agendamento cancelado.");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meus-agendamentos"] }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "admin" &&
            query.queryKey[2] === "agendamentos",
        }),
        queryClient.invalidateQueries({ queryKey: ["agendar", "horarios"] }),
      ]);
    },
    onSettled: () => {
      envioEmCurso.current = false;
    },
  });
  useEffect(() => {
    document.title = "Meus agendamentos — Corte Certo";
    // Atualiza somente a classificação local, sem consultas periódicas à API.
    const intervalo = window.setInterval(
      () => definirAgora(Date.now()),
      30_000,
    );
    return () => window.clearInterval(intervalo);
  }, []);
  useEffect(() => {
    if (cancelando) dialogo.current?.showModal();
    else if (dialogo.current?.open) dialogo.current.close();
  }, [cancelando]);
  const grupos = organizarAgendamentos(consulta.data ?? [], agora);
  const itens = grupos[aba];
  const totalPaginas = Math.max(1, Math.ceil(itens.length / POR_PAGINA));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const mudarAba = (nova: typeof aba) => {
    definirAba(nova);
    definirPagina(1);
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <Link to="/" className="font-serif text-xl font-bold text-primary">
              Corte Certo
            </Link>
            <button
              className="rounded px-2 py-2 text-sm text-primary underline focus-visible:outline-primary"
              onClick={() => void sair()}
            >
              Sair
            </button>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <div className="min-w-0 flex-1 basis-64 break-words">
              <h1
                ref={titulo}
                tabIndex={-1}
                className="font-serif text-3xl outline-none"
              >
                Meus agendamentos
              </h1>
              <p className="mt-2 text-sm text-foreground/75">
                Olá, {usuario?.nome}. Acompanhe seus próximos cuidados.
              </p>
            </div>
            <Link
              to="/agendar"
              className="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-primary"
            >
              Novo agendamento
            </Link>
          </div>
        </header>
        {aviso && (
          <p
            role="status"
            className="mb-4 rounded-xl border border-success/30 bg-success/10 p-3 text-sm text-success"
          >
            {aviso}
          </p>
        )}
        <div
          role="tablist"
          aria-label="Agendamentos"
          className="mb-4 flex gap-1 rounded-xl border border-border bg-surface p-1"
        >
          {(
            [
              ["proximos", "Próximos"],
              ["historico", "Histórico"],
            ] as const
          ).map(([valor, rotulo]) => (
            <button
              key={valor}
              id={`aba-${valor}`}
              role="tab"
              aria-selected={aba === valor}
              aria-controls="lista-agendamentos"
              tabIndex={aba === valor ? 0 : -1}
              onClick={() => mudarAba(valor)}
              onKeyDown={(e) => {
                if (
                  ["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)
                ) {
                  e.preventDefault();
                  const nova =
                    e.key === "Home"
                      ? "proximos"
                      : e.key === "End"
                        ? "historico"
                        : aba === "proximos"
                          ? "historico"
                          : "proximos";
                  mudarAba(nova);
                  document.getElementById(`aba-${nova}`)?.focus();
                }
              }}
              className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold focus-visible:outline-primary ${aba === valor ? "bg-primary text-white" : "text-primary hover:bg-background"}`}
            >
              {rotulo}{" "}
              <span className="rounded-full bg-current/10 px-2 text-xs">
                {consulta.isPending || consulta.isError
                  ? "—"
                  : grupos[valor].length}
              </span>
            </button>
          ))}
        </div>
        <section
          id="lista-agendamentos"
          role="tabpanel"
          aria-labelledby={`aba-${aba}`}
          tabIndex={0}
          className="rounded-xl focus-visible:outline-primary"
        >
          {consulta.isPending ? (
            <div
              role="status"
              aria-label="Carregando agendamentos"
              className="space-y-3"
            >
              <span className="sr-only">Carregando agendamentos…</span>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  aria-hidden="true"
                  className="rounded-2xl border border-border bg-surface p-5 motion-safe:animate-pulse"
                >
                  <div className="mb-4 h-12 rounded-lg bg-background" />
                  <div className="mb-3 h-5 w-2/3 rounded bg-background" />
                  <div className="h-5 w-1/2 rounded bg-background" />
                </div>
              ))}
            </div>
          ) : consulta.isError ? (
            <div
              role="alert"
              className="rounded-2xl border border-border bg-surface p-6"
            >
              <p>{mensagemErro(consulta.error)}</p>
              <Button
                variant="secondary"
                className="mt-4"
                isDisabled={consulta.isFetching}
                onPress={() => void consulta.refetch()}
              >
                {consulta.isFetching ? "Tentando…" : "Tentar novamente"}
              </Button>
            </div>
          ) : !itens.length ? (
            <div
              className="rounded-2xl border border-border bg-surface px-5 py-10 text-center"
              role="status"
            >
              <h2 className="font-serif text-xl">
                {aba === "proximos"
                  ? "Nenhum atendimento próximo"
                  : "Seu histórico ainda está vazio"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-foreground/75">
                {aba === "proximos"
                  ? "Quando você agendar um novo cuidado, ele aparecerá aqui."
                  : "Atendimentos anteriores, cancelados e não comparecimentos aparecerão aqui."}
              </p>
              {aba === "proximos" && (
                <Link
                  to="/agendar"
                  className="mt-4 inline-block rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white"
                >
                  Novo agendamento
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {itens
                .slice((paginaAtual - 1) * POR_PAGINA, paginaAtual * POR_PAGINA)
                .map((item) => (
                  <article
                    key={item.id}
                    aria-label={`Agendamento #${item.id}`}
                    className="min-w-0 rounded-2xl border border-border bg-surface p-4 sm:p-5"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-xs text-foreground/75">
                        Agendamento #{item.id}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusAgendamento status={item.status} />
                        {dataJaPassou(item, agora) && (
                          <span className="text-xs text-foreground/75">
                            Data já passou
                          </span>
                        )}
                      </div>
                    </div>
                    <ResumoAgendamento item={item} detalhes={false} />
                    <div className="mt-4 flex flex-wrap items-start justify-between gap-3 border-t border-border pt-3">
                      <details className="min-w-0 flex-1 basis-48">
                        <summary className="w-fit cursor-pointer rounded py-2 text-sm font-medium text-primary focus-visible:outline-primary">
                          Ver detalhes
                        </summary>
                        <DetalhesAgendamento item={item} />
                      </details>
                      {["PENDENTE", "CONFIRMADO"].includes(item.status) && (
                        <Button
                          variant="secondary"
                          className="shrink-0 rounded-lg border border-danger/30 bg-surface text-danger"
                          isDisabled={cancelamento.isPending}
                          aria-label={`Cancelar agendamento #${item.id}`}
                          onPress={() => {
                            origemFoco.current =
                              document.activeElement as HTMLElement;
                            cancelamento.reset();
                            definirMotivo("");
                            definirCancelando(item);
                          }}
                        >
                          Cancelar agendamento
                        </Button>
                      )}
                    </div>
                  </article>
                ))}
            </div>
          )}
          {!consulta.isPending && !consulta.isError && totalPaginas > 1 && (
            <nav
              aria-label="Paginação"
              className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm"
            >
              <Button
                variant="secondary"
                isDisabled={paginaAtual === 1}
                onPress={() => definirPagina(paginaAtual - 1)}
              >
                Anterior
              </Button>
              <span>
                Página {paginaAtual} de {totalPaginas}
              </span>
              <Button
                variant="secondary"
                isDisabled={paginaAtual === totalPaginas}
                onPress={() => definirPagina(paginaAtual + 1)}
              >
                Próxima
              </Button>
            </nav>
          )}
        </section>
        <dialog
          ref={dialogo}
          aria-labelledby="titulo-cancelamento"
          aria-describedby="descricao-cancelamento"
          onCancel={(e) => {
            if (cancelamento.isPending) e.preventDefault();
            else definirCancelando(null);
          }}
          onClose={() => {
            definirCancelando(null);
            (origemFoco.current?.isConnected
              ? origemFoco.current
              : titulo.current
            )?.focus();
          }}
          className="m-auto max-h-[90dvh] w-[calc(100%_-_2rem)] max-w-lg overflow-y-auto rounded-2xl border border-border bg-surface p-5 text-foreground backdrop:bg-foreground/40 sm:p-6"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (
                motivo.trim() &&
                !envioEmCurso.current &&
                !cancelamento.isPending
              ) {
                envioEmCurso.current = true;
                cancelamento.mutate();
              }
            }}
          >
            <h2 id="titulo-cancelamento" className="font-serif text-2xl">
              Cancelar agendamento?
            </h2>
            <p
              id="descricao-cancelamento"
              className="mt-2 text-sm text-foreground/75"
            >
              O horário será liberado para outro cliente.
            </p>
            {cancelando && (
              <div className="mt-4 rounded-xl bg-background p-3 text-sm break-words [overflow-wrap:anywhere]">
                <p className="font-semibold text-primary">
                  {dataHorario(cancelando.inicioPrevisto)}
                </p>
                <p className="mt-1">
                  {cancelando.servicos.map((s) => s.servico.nome).join(", ")}
                </p>
                <p className="mt-1 text-foreground/75">
                  Com {cancelando.barbeiro.nomeProfissional} · #{cancelando.id}
                </p>
              </div>
            )}
            <label
              htmlFor="motivo-cancelamento"
              className="mb-2 mt-4 block text-sm font-semibold"
            >
              Motivo do cancelamento
            </label>
            <p id="ajuda-motivo" className="mb-2 text-xs text-foreground/75">
              Obrigatório. Conte por que precisa cancelar.
            </p>
            <textarea
              id="motivo-cancelamento"
              autoFocus
              required
              rows={3}
              value={motivo}
              aria-describedby="ajuda-motivo"
              disabled={cancelamento.isPending}
              onChange={(e) => definirMotivo(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 text-sm focus-visible:outline-primary"
            />
            {cancelamento.isError && (
              <p role="alert" className="mt-3 text-sm text-danger">
                {mensagemErro(cancelamento.error)}
              </p>
            )}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                className="min-h-11 rounded-lg"
                isDisabled={cancelamento.isPending}
                onPress={() => definirCancelando(null)}
              >
                Manter agendamento
              </Button>
              <Button
                type="submit"
                className="min-h-11 rounded-lg bg-danger text-white disabled:opacity-50"
                isDisabled={!motivo.trim() || cancelamento.isPending}
              >
                {cancelamento.isPending
                  ? "Cancelando…"
                  : "Confirmar cancelamento"}
              </Button>
            </div>
          </form>
        </dialog>
      </div>
    </main>
  );
}
