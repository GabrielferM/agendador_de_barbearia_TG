export type NodeEnvironment = 'development' | 'test' | 'production';

export interface EnvironmentVariables {
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  FRONTEND_URL?: string;
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: NodeEnvironment;
  CORS_ORIGINS: string[];
  CSRF_SECRET: string;
}

type RawEnvironment = Record<string, unknown>;

function requiredString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${name} must be defined.`);
  }

  return value.trim();
}

function parseDatabaseUrl(value: unknown): string {
  const databaseUrl = requiredString(value, 'DATABASE_URL');

  try {
    const url = new URL(databaseUrl);
    if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
      throw new Error('DATABASE_URL must use the postgres or postgresql protocol.');
    }
  } catch (error) {
    if (error instanceof Error && error.message.startsWith('DATABASE_URL')) {
      throw error;
    }
    throw new Error('DATABASE_URL must be a valid PostgreSQL connection URL.');
  }

  return databaseUrl;
}

function parsePort(value: unknown): number {
  if (value === undefined || value === '') {
    return 3000;
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return port;
}

function parseNodeEnvironment(value: unknown): NodeEnvironment {
  if (value === undefined || value === '') {
    return 'development';
  }

  if (value === 'development' || value === 'test' || value === 'production') {
    return value;
  }

  throw new Error('NODE_ENV must be development, test, or production.');
}

function parseCorsOrigins(value: unknown, environment: NodeEnvironment): string[] {
  if (value === undefined || value === '') {
    if (environment === 'production') {
      throw new Error('CORS_ORIGINS must be defined in production.');
    }
    return [];
  }

  if (typeof value !== 'string') {
    throw new Error('CORS_ORIGINS must be a comma-separated list of URLs.');
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  if (origins.length === 0) {
    throw new Error('CORS_ORIGINS must contain at least one URL.');
  }

  for (const origin of origins) {
    try {
      const url = new URL(origin);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error();
      }
    } catch {
      throw new Error(`CORS_ORIGINS contains an invalid origin: ${origin}.`);
    }
  }

  return origins;
}

export function validateEnvironment(config: RawEnvironment): EnvironmentVariables {
  const nodeEnvironment = parseNodeEnvironment(config.NODE_ENV);
  const segredoInformado = config.CSRF_SECRET;
  const csrfSecret =
    segredoInformado === undefined && nodeEnvironment !== 'production'
      ? 'segredo-local-apenas-para-desenvolvimento-123456'
      : requiredString(segredoInformado, 'CSRF_SECRET');
  if (csrfSecret.length < 32) throw new Error('CSRF_SECRET must contain at least 32 characters.');

  const corsOrigins = parseCorsOrigins(config.CORS_ORIGINS, nodeEnvironment);
  const emailConfig = validarEmail(config, nodeEnvironment);
  return {
    ...emailConfig,
    DATABASE_URL: parseDatabaseUrl(config.DATABASE_URL),
    PORT: parsePort(config.PORT),
    NODE_ENV: nodeEnvironment,
    CORS_ORIGINS: corsOrigins,
    CSRF_SECRET: csrfSecret,
  };
}

export function corsOriginFor(environment: EnvironmentVariables): string[] | RegExp {
  if (environment.NODE_ENV === 'production') {
    return environment.CORS_ORIGINS;
  }

  return /^https?:\/\/localhost(?::\d+)?$/;
}

function validarEmail(config: RawEnvironment, environment: NodeEnvironment) {
  const key = typeof config.RESEND_API_KEY === 'string' ? config.RESEND_API_KEY.trim() : '';
  const from = typeof config.EMAIL_FROM === 'string' ? config.EMAIL_FROM.trim() : '';
  const frontend = typeof config.FRONTEND_URL === 'string' ? config.FRONTEND_URL.trim() : '';
  if (!key && !from && !frontend && environment !== 'production') return {};
  if (!key || !from || !frontend)
    throw new Error('Configure RESEND_API_KEY, EMAIL_FROM e FRONTEND_URL.');
  if (!/^re_[A-Za-z0-9_-]+$/.test(key) || !/^[^<>\r\n]+@[^<>\s]+\.[^<>\s]+$/.test(from))
    throw new Error('Configuração de e-mail inválida. EMAIL_FROM deve conter somente o endereço.');
  let url: URL;
  try {
    url = new URL(frontend);
  } catch {
    throw new Error('FRONTEND_URL inválida.');
  }
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash ||
    (environment === 'production' && url.protocol !== 'https:')
  )
    throw new Error('FRONTEND_URL deve ser uma origem confiável; HTTPS é obrigatório em produção.');
  return { RESEND_API_KEY: key, EMAIL_FROM: from, FRONTEND_URL: url.origin };
}
