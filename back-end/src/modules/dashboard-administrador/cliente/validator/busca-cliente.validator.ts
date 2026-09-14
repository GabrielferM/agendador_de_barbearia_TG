export function normalizarBuscaCliente(busca?: string) {
  const valor = busca?.trim();
  return valor ? valor : undefined;
}
