export function obterSenhaSeed(valor: string | undefined): string {
  if (!valor?.trim()) {
    throw new Error('SEED_DEFAULT_PASSWORD deve estar definida para executar o seed.');
  }
  if (valor.length < 15 || valor.length > 128) {
    throw new Error('SEED_DEFAULT_PASSWORD deve conter entre 15 e 128 caracteres.');
  }

  return valor;
}
