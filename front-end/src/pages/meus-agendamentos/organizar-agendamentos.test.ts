import { describe, expect, it } from "vitest";
import type { AgendamentoRespostaDto } from "../../api/models";
import { organizarAgendamentos, dataJaPassou } from "./organizar-agendamentos";
import { dataHorario } from "../agendamento/formatadores";
const item = (
  id: number,
  status: AgendamentoRespostaDto["status"],
  inicioPrevisto: string,
) => ({ id, status, inicioPrevisto }) as AgendamentoRespostaDto;

describe("Classificação dos agendamentos do cliente", () => {
  const agora = Date.parse("2030-01-08T02:30:00Z"); // 07/01 às 23:30 em Brasília
  it("prioriza atendimento atual e ordena futuros; histórico mantém status e ordem decrescente", () => {
    const itens = [
      item(1, "PENDENTE", "2030-01-08T03:00:00Z"),
      item(2, "CONFIRMADO", "2030-01-08T02:00:00Z"),
      item(3, "EM_ATENDIMENTO", "2030-01-07T12:00:00Z"),
      item(4, "CONCLUIDO", "2030-01-06T12:00:00Z"),
      item(5, "CANCELADO", "2030-01-09T12:00:00Z"),
      item(6, "NAO_COMPARECEU", "2030-01-05T12:00:00Z"),
      item(7, "CONFIRMADO", "2030-01-09T12:00:00Z"),
      item(8, "PENDENTE", "2030-01-08T02:30:00Z"),
    ];
    const resultado = organizarAgendamentos(itens, agora);
    expect(resultado.proximos.map((i) => i.id)).toEqual([3, 8, 1, 7]);
    expect(resultado.historico.map((i) => i.id)).toEqual([5, 2, 4, 6]);
    expect(resultado.historico.find((i) => i.id === 2)?.status).toBe(
      "CONFIRMADO",
    );
    expect(itens.map((i) => i.id)).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });
  it("compara instantes com offsets equivalentes e formata o dia de São Paulo perto da meia-noite", () => {
    const registro = item(1, "PENDENTE", "2030-01-07T23:00:00-03:00");
    expect(dataJaPassou(registro, agora)).toBe(true);
    expect(dataJaPassou({ ...registro, status: "CANCELADO" }, agora)).toBe(
      false,
    );
    expect(dataHorario("2030-01-08T02:00:00Z")).toContain(
      "7 de janeiro de 2030",
    );
    expect(dataHorario("2030-01-08T03:00:00Z")).toContain(
      "8 de janeiro de 2030",
    );
  });
});
