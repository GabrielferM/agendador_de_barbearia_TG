export type NodeEnvironment = 'development' | 'test' | 'production';

export interface EnvironmentVariables {
  DATABASE_URL: string;
  PORT: number;
  NODE_ENV: NodeEnvironment;
  CORS_ORIGINS: string[];
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

  return {
    DATABASE_URL: parseDatabaseUrl(config.DATABASE_URL),
    PORT: parsePort(config.PORT),
    NODE_ENV: nodeEnvironment,
    CORS_ORIGINS: parseCorsOrigins(config.CORS_ORIGINS, nodeEnvironment),
  };
}

export function corsOriginFor(environment: EnvironmentVariables): string[] | RegExp {
  if (environment.NODE_ENV === 'production') {
    return environment.CORS_ORIGINS;
  }

  return /^https?:\/\/localhost(?::\d+)?$/;
}
