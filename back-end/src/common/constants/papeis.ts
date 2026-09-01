export const CODIGOS_PAPEL = {
  ADMINISTRADOR: 'ADMINISTRADOR',
  BARBEIRO: 'BARBEIRO',
  CLIENTE: 'CLIENTE',
} as const;

export type CodigoPapel = (typeof CODIGOS_PAPEL)[keyof typeof CODIGOS_PAPEL];
