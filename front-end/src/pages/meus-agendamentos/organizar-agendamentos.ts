import type { AgendamentoRespostaDto } from "../../api/models";

const STATUS_FINAIS = new Set(["CONCLUIDO", "CANCELADO", "NAO_COMPARECEU"]);

export function dataJaPassou(item: AgendamentoRespostaDto, agora: number) {
  return (
    item.status !== "EM_ATENDIMENTO" &&
    !STATUS_FINAIS.has(item.status) &&
    Date.parse(item.inicioPrevisto) < agora
  );
}

export function organizarAgendamentos(
  itens: AgendamentoRespostaDto[],
  agora: number,
) {
  const proximos: AgendamentoRespostaDto[] = [];
  const historico: AgendamentoRespostaDto[] = [];
  for (const item of itens) {
    (STATUS_FINAIS.has(item.status) || dataJaPassou(item, agora)
      ? historico
      : proximos
    ).push(item);
  }
  proximos.sort(
    (a, b) =>
      Number(b.status === "EM_ATENDIMENTO") -
        Number(a.status === "EM_ATENDIMENTO") ||
      Date.parse(a.inicioPrevisto) - Date.parse(b.inicioPrevisto) ||
      a.id - b.id,
  );
  historico.sort(
    (a, b) =>
      Date.parse(b.inicioPrevisto) - Date.parse(a.inicioPrevisto) ||
      b.id - a.id,
  );
  return { proximos, historico };
}
