import type { VisualizacaoAgenda } from "./types";

export function hojeBarbearia() {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo", year: "numeric", month: "2-digit", day: "2-digit",
  }).formatToParts(new Date());
  const valor = (tipo: string) => partes.find(parte => parte.type === tipo)!.value;
  return `${valor("year")}-${valor("month")}-${valor("day")}`;
}

export function deslocarData(data: string, dias: number) {
  const resultado = new Date(`${data}T12:00:00Z`);
  resultado.setUTCDate(resultado.getUTCDate() + dias);
  return resultado.toISOString().slice(0, 10);
}

export function periodoAgenda(data: string, visualizacao: VisualizacaoAgenda) {
  if (visualizacao === "Dia") return { inicioDe: data, inicioAte: data };
  const referencia = new Date(`${data}T12:00:00Z`);
  if (visualizacao === "Semana") {
    const inicioDe = deslocarData(data, -((referencia.getUTCDay() + 6) % 7));
    return { inicioDe, inicioAte: deslocarData(inicioDe, 6) };
  }
  const inicioDe = `${data.slice(0, 7)}-01`;
  referencia.setUTCMonth(referencia.getUTCMonth() + 1, 0);
  return { inicioDe, inicioAte: referencia.toISOString().slice(0, 10) };
}

export function moverPeriodo(data: string, visualizacao: VisualizacaoAgenda, direcao: number) {
  if (visualizacao !== "Mês") return deslocarData(data, direcao * (visualizacao === "Semana" ? 7 : 1));
  const referencia = new Date(`${data.slice(0, 7)}-01T12:00:00Z`);
  referencia.setUTCMonth(referencia.getUTCMonth() + direcao);
  return referencia.toISOString().slice(0, 10);
}

export function formatarDia(data: string, completa = false) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    ...(completa ? { dateStyle: "full" as const } : { day: "2-digit" as const, month: "2-digit" as const }),
  }).format(new Date(`${data}T12:00:00-03:00`));
}
