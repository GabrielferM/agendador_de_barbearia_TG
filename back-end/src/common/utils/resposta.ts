import { Prisma } from '@prisma/client';

export function serializarResposta<T>(valor: T): T {
  if (valor instanceof Prisma.Decimal) return valor.toFixed(2) as T;
  if (valor instanceof Date) return valor.toISOString() as T;
  if (Array.isArray(valor)) return valor.map(serializarResposta) as T;
  if (valor && typeof valor === 'object') {
    return Object.fromEntries(
      Object.entries(valor as Record<string, unknown>).map(([chave, item]) => [
        chave,
        serializarResposta(item),
      ]),
    ) as T;
  }
  return valor;
}

export function semSenha<T extends { senha?: unknown }>(usuario: T) {
  const { senha: _, ...resultado } = usuario;
  return serializarResposta(resultado);
}
