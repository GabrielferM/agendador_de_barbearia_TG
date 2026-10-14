import type { AgendamentoControllerListarParams } from "../../api/models";
import { Button } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAutenticacao } from "../../auth/contexto-autenticacao";
import {
  cancelarAgendamento,
  buscarMeuAgendamento,
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
  const [aba, definirAba] = useState("proximos");
  const [agora] = useState(() => new Date().toISOString());
  const [filtros, definirFiltros] = useState<AgendamentoControllerListarParams>(
    {},
  );
  const [detalhe, definirDetalhe] = useState<number | null>(null);
  const [pagina, definirPagina] = useState(1);
  const [cancelando, definirCancelando] = useState<number | null>(null);
  const [motivo, definirMotivo] = useState("");
  const [aviso, definirAviso] = useState("");
  const dialogo = useRef<HTMLDialogElement>(null);
  const queryClient = useQueryClient();
  const consulta = useQuery({
    queryKey: ["meus-agendamentos", usuario?.id, pagina, aba, agora, filtros],
    queryFn: ({ signal }) =>
      listarAgendamentos(pagina, signal, {
        ...filtros,
        inicioDe:
          aba === "proximos"
            ? filtros.inicioDe && filtros.inicioDe > agora
              ? filtros.inicioDe
              : agora
            : filtros.inicioDe,
        inicioAte:
          aba === "historico"
            ? filtros.inicioAte && filtros.inicioAte < agora
              ? filtros.inicioAte
              : new Date(Date.parse(agora) - 1).toISOString()
            : filtros.inicioAte,
      }),
    enabled: !!usuario,
  });
  const consultaDetalhe = useQuery({
    queryKey: ["meu-agendamento", usuario?.id, detalhe],
    queryFn: ({ signal }) => buscarMeuAgendamento(detalhe!, signal),
    enabled: detalhe !== null && !!usuario,
    retry: false,
  });
  const cancelamento = useMutation({
    mutationFn: () => cancelarAgendamento(cancelando!, motivo.trim()),
    retry: false,
    onSuccess: async () => {
      definirCancelando(null);
      definirMotivo("");
      definirAviso("Agendamento cancelado.");
      await Promise.all(
        [
          "meus-agendamentos",
          "meu-agendamento",
          "agenda-barbeiro",
          "atendimento",
          "historico-status",
          "dashboard",
        ].map((key) => queryClient.invalidateQueries({ queryKey: [key] })),
      );
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
        <nav aria-label="Período dos agendamentos" className="mb-4 flex gap-3">
          {[
            ["proximos", "Próximos"],
            ["historico", "Histórico"],
          ].map(([valor, rotulo]) => (
            <Button
              key={valor}
              variant={aba === valor ? "primary" : "secondary"}
              aria-pressed={aba === valor}
              onPress={() => {
                definirAba(valor);
                definirPagina(1);
                definirDetalhe(null);
              }}
            >
              {rotulo}
            </Button>
          ))}
        </nav>
        <p className="mb-4 text-sm text-muted">
          A separação usa a data prevista e preserva a situação do agendamento.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const dados = new FormData(e.currentTarget);
            const de = String(dados.get("de"));
            const ate = String(dados.get("ate"));
            const status = String(dados.get("status"));
            definirFiltros({
              inicioDe: de
                ? new Date(`${de}T00:00:00-03:00`).toISOString()
                : undefined,
              inicioAte: ate
                ? new Date(`${ate}T23:59:59.999-03:00`).toISOString()
                : undefined,
              status: status
                ? (status as AgendamentoControllerListarParams["status"])
                : undefined,
            });
            definirPagina(1);
          }}
          className="mb-5 flex flex-wrap items-end gap-3"
        >
          <label>
            De
            <input
              name="de"
              type="date"
              className="block rounded-lg border border-border bg-surface p-2"
            />
          </label>
          <label>
            Até
            <input
              name="ate"
              type="date"
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
              {Object.entries(rotulos).map(([valor, rotulo]) => (
                <option key={valor} value={valor}>
                  {rotulo}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit">Aplicar filtros</Button>
          <Button
            type="reset"
            variant="secondary"
            onPress={() => {
              definirFiltros({});
              definirPagina(1);
            }}
          >
            Limpar
          </Button>
        </form>
        {detalhe !== null && (
          <section
            className="mb-5 rounded-2xl border border-border bg-surface p-5"
            aria-label={`Detalhe do agendamento ${detalhe}`}
          >
            <h2 className="mb-3 font-semibold">Detalhes #{detalhe}</h2>
            <EstadoConsulta
              carregando={consultaDetalhe.isPending}
              erro={consultaDetalhe.error}
              vazio={!consultaDetalhe.data}
              tentar={() => void consultaDetalhe.refetch()}
            >
              {consultaDetalhe.data && (
                <ResumoAgendamento item={consultaDetalhe.data} />
              )}
            </EstadoConsulta>
            <Button variant="secondary" onPress={() => definirDetalhe(null)}>
              Fechar detalhes
            </Button>
          </section>
        )}
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
                <Button
                  className="mt-3"
                  variant="secondary"
                  onPress={() => definirDetalhe(item.id)}
                >
                  Visualizar #{item.id}
                </Button>
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
