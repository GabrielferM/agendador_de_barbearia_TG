export const moeda = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export const numero = new Intl.NumberFormat("pt-BR");

export function dataCurta(valor: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(valor));
}

export function hora(valor: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(valor));
}

export function nomeStatus(status: string) {
  return status
    .toLocaleLowerCase("pt-BR")
    .replaceAll("_", " ")
    .replace(/^./, (letra) => letra.toUpperCase());
}
