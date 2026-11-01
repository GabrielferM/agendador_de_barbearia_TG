import { expect, it } from "vitest";
import { celulasMes, chaveDiaBarbearia, deslocarData, formatarPeriodo, moverPeriodo, periodoAgenda } from "./calendario";

it("usa o dia comercial de São Paulo ao redor da meia-noite", () => {
  expect(chaveDiaBarbearia(new Date("2027-01-01T02:59:59Z"))).toBe("2026-12-31");
  expect(chaveDiaBarbearia(new Date("2027-01-01T03:00:00Z"))).toBe("2027-01-01");
});
it("calcula períodos com virada de ano e ano bissexto", () => {
  expect(periodoAgenda("2027-01-01", "Semana")).toEqual({ inicioDe: "2026-12-28", inicioAte: "2027-01-03" });
  expect(periodoAgenda("2028-02-29", "Mês")).toEqual({ inicioDe: "2028-02-01", inicioAte: "2028-02-29" });
  expect(moverPeriodo("2026-12-31", "Mês", 1)).toBe("2027-01-01");
  expect(moverPeriodo("2027-01-01", "Dia", -1)).toBe("2026-12-31");
  expect(moverPeriodo("2027-01-01", "Semana", -1)).toBe("2026-12-25");
});
it("abrevia períodos sem omitir o mês ou ano necessário", () => {
  expect(formatarPeriodo("2026-10-26", "2026-11-01")).toBe("26 out – 1 nov, 2026");
  expect(formatarPeriodo("2026-12-28", "2027-01-03")).toBe("28 dez 2026 – 3 jan 2027");
  expect(formatarPeriodo("2026-10-01", "2026-10-31")).toBe("1 – 31 out, 2026");
});
it("alinha meses iniciados em cada dia da semana, sem repetir datas", () => {
  for (let mes = 1; mes <= 12; mes++) {
    const { inicioDe, inicioAte } = periodoAgenda(`2026-${String(mes).padStart(2, "0")}-15`, "Mês");
    const dias = [];
    for (let data = inicioDe; data <= inicioAte; data = deslocarData(data, 1)) dias.push({ data });
    const celulas = celulasMes(dias);
    expect(celulas.length % 7).toBe(0);
    expect(celulas.filter(Boolean)).toEqual(dias);
    expect(celulas.findIndex(Boolean)).toBe((new Date(`${inicioDe}T12:00:00Z`).getUTCDay() + 6) % 7);
  }
});
