export function normalizarBuscaServico(busca?: string) {
  const valor = busca?.trim();
  return valor ? valor : undefined;
}

export function converterAtivo(ativo?: string) {
  return ativo === undefined ? undefined : ativo === 'true';
}
