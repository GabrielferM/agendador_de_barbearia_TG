import { Button } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { dataHorario } from "../../../../agendamento/formatadores";
import {
  ErroAgendamento,
  mensagemErro,
} from "../../../../agendamento/services/agendamento-api";
import {
  atualizarAtendimento,
  type AgendamentoBarbeiro,
} from "../services/agenda-barbeiro-api";
const ACOES: Record<
  string,
  { status: AgendamentoBarbeiro["status"]; rotulo: string }[]
> = {
  PENDENTE: [
    { status: "CONFIRMADO", rotulo: "Confirmar" },
    { status: "CANCELADO", rotulo: "Cancelar" },
  ],
  CONFIRMADO: [
    { status: "EM_ATENDIMENTO", rotulo: "Iniciar" },
    { status: "CANCELADO", rotulo: "Cancelar" },
    { status: "NAO_COMPARECEU", rotulo: "Não compareceu" },
  ],
  EM_ATENDIMENTO: [{ status: "CONCLUIDO", rotulo: "Concluir" }],
};
export function AcoesAtendimento({
  item,
  atualizar = atualizarAtendimento,
}: {
  item: AgendamentoBarbeiro;
  atualizar?: typeof atualizarAtendimento;
}) {
  const [acao, definirAcao] = useState<{
    status: AgendamentoBarbeiro["status"];
    rotulo: string;
  } | null>(null);
  const [motivo, definirMotivo] = useState("");
  const [aviso, definirAviso] = useState("");
  const dialogo = useRef<HTMLDialogElement>(null);
  const disparador = useRef<HTMLElement | null>(null);
  const cache = useQueryClient();
  async function atualizarConsultas() {
    await Promise.all(
      [
        "atendimento",
        "agenda-barbeiro",
        "historico-barbeiro",
        "historico-status",
        "meus-agendamentos",
        "dashboard",
        "agendar",
        "agenda-admin",
      ].map((key) => cache.invalidateQueries({ queryKey: [key] })),
    );
  }
  const mutacao = useMutation({
    mutationFn: () => atualizar(item.id, acao!.status, motivo.trim()),
    retry: false,
    onSuccess: async () => {
      definirAcao(null);
      definirAviso("Atendimento atualizado.");
      await atualizarConsultas();
    },
    onError: async (erro) => {
      if (erro instanceof ErroAgendamento && erro.status === 409) {
        definirAcao(null);
        definirAviso(
          "A agenda mudou. Confira o estado atualizado antes de continuar.",
        );
        await atualizarConsultas();
      }
    },
  });
  useEffect(() => {
    if (acao) dialogo.current?.showModal();
    else {
      dialogo.current?.close();
      disparador.current?.focus();
    }
  }, [acao]);
  return (
    <div className="mt-5">
      {item.inicioReal && <p>Início real: {dataHorario(item.inicioReal)}</p>}
      {item.fimReal && <p>Fim real: {dataHorario(item.fimReal)}</p>}
      {aviso && (
        <p role="status" className="my-3 text-success">
          {aviso}
        </p>
      )}
      <div className="flex flex-wrap gap-3">
        {(ACOES[item.status] ?? []).map((a) => (
          <Button
            key={a.status}
            variant="secondary"
            onPress={() => {
              disparador.current = document.activeElement as HTMLElement;
              mutacao.reset();
              definirMotivo("");
              definirAcao(a);
            }}
          >
            {a.rotulo}
          </Button>
        ))}
      </div>
      <dialog
        ref={dialogo}
        aria-labelledby="acao-atendimento"
        onCancel={(e) => {
          if (mutacao.isPending) e.preventDefault();
          else definirAcao(null);
        }}
        className="m-auto w-full max-w-md rounded-2xl border border-border bg-surface p-6 text-foreground backdrop:bg-foreground/40"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (
              !mutacao.isPending &&
              (acao?.status !== "CANCELADO" || motivo.trim())
            )
              mutacao.mutate();
          }}
        >
          <h2 id="acao-atendimento" className="font-serif text-2xl">
            {acao?.rotulo} atendimento?
          </h2>
          <p className="my-3">
            {item.cliente.nome} · {dataHorario(item.inicioPrevisto)} · #
            {item.id}
          </p>
          {acao?.status === "CANCELADO" && (
            <label className="block">
              Motivo obrigatório
              <textarea
                autoFocus
                required
                value={motivo}
                disabled={mutacao.isPending}
                onChange={(e) => definirMotivo(e.target.value)}
                className="mt-2 w-full rounded-lg border border-border bg-surface p-3"
              />
            </label>
          )}
          {mutacao.isError && (
            <p role="alert" className="my-3 text-danger">
              {mensagemErro(mutacao.error)} Consulte o detalhe antes de repetir
              uma ação com resultado incerto.
            </p>
          )}
          <div className="mt-5 flex justify-end gap-3">
            <Button
              variant="secondary"
              isDisabled={mutacao.isPending}
              onPress={() => definirAcao(null)}
            >
              Voltar
            </Button>
            <Button
              type="submit"
              isDisabled={
                mutacao.isPending ||
                (acao?.status === "CANCELADO" && !motivo.trim())
              }
            >
              {mutacao.isPending ? "Salvando…" : "Confirmar ação"}
            </Button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
