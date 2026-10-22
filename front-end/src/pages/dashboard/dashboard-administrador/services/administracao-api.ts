import { executarHttp } from '../../../../api/operacao-http';
import type { MetaPaginacaoDto } from '../../../../api/models';

export function registro(valor: unknown): Record<string, unknown> {
  if (!valor || typeof valor !== 'object' || Array.isArray(valor)) throw new Error('Resposta administrativa inválida.');
  return valor as Record<string, unknown>;
}
export function texto(valor: unknown): string {
  if (typeof valor !== 'string') throw new Error('Resposta administrativa inválida.');
  return valor;
}
export function numero(valor: unknown): number {
  if (typeof valor !== 'number' || !Number.isFinite(valor)) throw new Error('Resposta administrativa inválida.');
  return valor;
}
export function lista<T>(valor: unknown, validar: (item: unknown) => T): { data: T[]; meta: MetaPaginacaoDto } {
  const obj = registro(valor), meta = registro(obj.meta);
  if (!Array.isArray(obj.data) || !['pagina', 'limite', 'total', 'totalPaginas'].every(c => Number.isInteger(meta[c]) && Number(meta[c]) >= 0)) throw new Error('Paginação administrativa inválida.');
  return { data: obj.data.map(validar), meta: meta as unknown as MetaPaginacaoDto };
}
export { executarHttp };
