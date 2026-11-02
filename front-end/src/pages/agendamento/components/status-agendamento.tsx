import type { AgendamentoRespostaDto } from "../../../api/models";

const STATUS: Record<
  AgendamentoRespostaDto["status"],
  { rotulo: string; classe: string }
> = {
  PENDENTE: { rotulo: "Pendente", classe: "bg-secondary/20 text-primary" },
  CONFIRMADO: { rotulo: "Confirmado", classe: "bg-success/10 text-success" },
  EM_ATENDIMENTO: { rotulo: "Em atendimento", classe: "bg-primary text-white" },
  CONCLUIDO: { rotulo: "Concluído", classe: "bg-success/10 text-success" },
  CANCELADO: { rotulo: "Cancelado", classe: "bg-danger/10 text-danger" },
  NAO_COMPARECEU: {
    rotulo: "Não compareceu",
    classe: "bg-background text-foreground",
  },
};

export function StatusAgendamento({
  status,
}: {
  status: AgendamentoRespostaDto["status"];
}) {
  const apresentacao = STATUS[status];
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${apresentacao?.classe ?? "bg-background text-foreground"}`}
    >
      {apresentacao?.rotulo ?? status}
    </span>
  );
}
