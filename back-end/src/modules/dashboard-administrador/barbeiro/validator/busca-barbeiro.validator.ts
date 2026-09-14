export function normalizarBuscaBarbeiro(busca?: string) {
  const valor = busca?.trim();
  return valor ? valor : undefined;
}
