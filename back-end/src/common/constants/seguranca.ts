export const SENHA_MINIMA = 15;
export const SENHA_MAXIMA = 128;
export const ARGON2_CONFIG = {
  memoryCost: 19 * 1024,
  timeCost: 2,
  parallelism: 1,
} as const;

export const SESSAO_DURACAO_MS = 7 * 24 * 60 * 60 * 1000;
export const SESSAO_INATIVIDADE_MS = 8 * 60 * 60 * 1000;
export const SESSAO_ATUALIZAR_USO_MS = 5 * 60 * 1000;
