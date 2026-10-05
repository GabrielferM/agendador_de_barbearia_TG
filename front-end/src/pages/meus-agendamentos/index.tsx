import { Button } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAutenticacao } from "../../auth/contexto-autenticacao";
import {
  cancelarAgendamento,
  listarAgendamentos,
  mensagemErro,
} from "../agendamento/services/agendamento-api";
import { ResumoAgendamento } from "../agendamento/components/resumo-agendamento";
import { EstadoConsulta } from "../agendamento/components/etapas-agendamento";

const rotulos: Record<string, string> = {
  PENDENTE: "Pendente",
  CONFIRMADO: "Confirmado",
  EM_ATENDIMENTO: "Em atendimento",
  CONCLUIDO: "Concluído",
  CANCELADO: "Cancelado",
  NAO_COMPARECEU: "Não compareceu",
};
export function MeusAgendamentos() {
  const { usuario, sair } = useAutenticacao();
  const [pagina, definirPagina] = useState(1);
  const [cancelando, definirCancelando] = useState<number | null>(null);
  const [motivo, definirMotivo] = useState("");
  const [aviso, definirAviso] = useState("");
  const dialogo = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const consulta = useQuery({
    queryKey: ["meus-agendamentos", usuario?.id, pagina],
    queryFn: ({ signal }) => listarAgendamentos(pagina, signal),
    enabled: !!usuario,
  });
  const cancelamento = useMutation({
    mutationFn: () => cancelarAgendamento(cancelando!, motivo.trim()),
    retry: false,
    onSuccess: async () => {
      definirCancelando(null);
      definirMotivo("");
      definirAviso("Agendamento cancelado.");
      await queryClient.invalidateQueries({ queryKey: ["meus-agendamentos"] });
      await queryClient.invalidateQueries({
        queryKey: ["agendar", "horarios"],
      });
    },
  });
  useEffect(() => {
    if (cancelando !== null) dialogo.current?.showModal();
    else dialogo.current?.close();
  }, [cancelando]);
  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto max-w-4xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="font-serif text-xl font-bold text-primary">
              Corte Certo
            </Link>
            <h1 className="mt-4 font-serif text-3xl">Meus agendamentos</h1>
            <p className="mt-2 text-muted">
              Olá, {usuario?.nome}. Acompanhe seus próximos cuidados.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/agendar"
              className="rounded-lg bg-primary px-5 py-3 font-semibold text-white"
            >
              Novo agendamento
            </Link>
            <button
              className="text-sm text-primary underline"
              onClick={() => void sair()}
            >
              Sair
            </button>
          </div>
        </header>
        {aviso && (
          <p role="status" className="mb-5 text-success">
            {aviso}
          </p>
        )}
        <EstadoConsulta
          carregando={consulta.isPending}
          erro={consulta.error}
          vazio={!consulta.data?.data.length}
          tentar={() => void consulta.refetch()}
        >
          <div className="space-y-5">
            {consulta.data?.data.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-border bg-surface p-5 sm:p-7"
              >
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="font-semibold">Agendamento #{item.id}</h2>
                  <span className="rounded-full bg-background px-3 py-1 text-sm text-primary">
                    {rotulos[item.status] ?? item.status}
                  </span>
                </div>
                <ResumoAgendamento item={item} />
                {item.motivoCancelamento && (
                  <p className="mt-4 text-sm">
                    Motivo do cancelamento: {item.motivoCancelamento}
                  </p>
                )}
                {["PENDENTE", "CONFIRMADO"].includes(item.status) && (
                  <Button
                    variant="secondary"
                    className="mt-5 text-danger"
                    onPress={() => {
                      cancelamento.reset();
                      definirMotivo("");
                      definirCancelando(item.id);
                    }}
                  >
                    Cancelar agendamento #{item.id}
                  </Button>
                )}
              </article>
            ))}
          </div>
        </EstadoConsulta>
        {consulta.data && consulta.data.meta.totalPaginas > 1 && (
          <nav
            aria-label="Paginação"
            className="mt-6 flex items-center justify-between"
          >
            <Button
              variant="secondary"
              isDisabled={pagina === 1}
              onPress={() => definirPagina((p) => p - 1)}
            >
              Anterior
            </Button>
            <span>
              Página {pagina} de {consulta.data.meta.totalPaginas}
            </span>
            <Button
              variant="secondary"
              isDisabled={pagina >= consulta.data.meta.totalPaginas}
              onPress={() => definirPagina((p) => p + 1)}
            >
              Próxima
            </Button>
          </nav>
        )}
        <dialog
          ref={dialogo}
          aria-labelledby="titulo-cancelamento"
          onCancel={(e) => {
            if (cancelamento.isPending) e.preventDefault();
            else definirCancelando(null);
          }}
          className="m-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground backdrop:bg-foreground/40"
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (motivo.trim() && !cancelamento.isPending)
                cancelamento.mutate();
            }}
          >
            <h2 id="titulo-cancelamento" className="font-serif text-2xl">
              Cancelar agendamento?
            </h2>
            <p className="mt-3 text-sm text-muted">
              O horário será liberado para outro cliente.
            </p>
            <label
              htmlFor="motivo-cancelamento"
              className="mb-2 mt-5 block font-semibold"
            >
              Motivo do cancelamento
            </label>
            <textarea
              id="motivo-cancelamento"
              autoFocus
              required
              rows={3}
              value={motivo}
              disabled={cancelamento.isPending}
              onChange={(e) => definirMotivo(e.target.value)}
              className="w-full rounded-lg border border-border bg-surface p-3 focus-visible:outline-primary"
            />
            {cancelamento.isError && (
              <p role="alert" className="mt-3 text-danger">
                {mensagemErro(cancelamento.error)}
              </p>
            )}
            <div className="mt-5 flex justify-end gap-3">
              <Button
                variant="secondary"
                isDisabled={cancelamento.isPending}
                onPress={() => definirCancelando(null)}
              >
                Manter agendamento
              </Button>
              <Button
                type="submit"
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
