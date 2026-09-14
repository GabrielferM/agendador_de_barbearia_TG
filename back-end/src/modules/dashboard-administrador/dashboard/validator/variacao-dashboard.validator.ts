export function calcularVariacao(atual: number, anterior: number) {
  if (anterior === 0) return atual === 0 ? 0 : 100;
  return Math.round(((atual - anterior) / anterior) * 100);
}
