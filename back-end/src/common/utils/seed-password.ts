export function obterSenhaSeed(valor: string | undefined): string {
  if (!valor?.trim()) {
    throw new Error('SEED_DEFAULT_PASSWORD deve estar definida para executar o seed.');
  }

  return valor;
}
