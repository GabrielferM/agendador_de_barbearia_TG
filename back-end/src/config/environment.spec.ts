import { corsOriginFor, validateEnvironment } from './environment';

const databaseUrl = 'postgresql://user:password@localhost:5432/barbearia';

describe('environment configuration', () => {
  it('rejects production without CORS origins', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: databaseUrl,
        NODE_ENV: 'production',
        CSRF_SECRET: 'um-segredo-de-teste-com-mais-de-32-caracteres',
      }),
    ).toThrow('CORS_ORIGINS must be defined in production.');
  });

  it('accepts a production origin list', () => {
    const environment = validateEnvironment({
      DATABASE_URL: databaseUrl,
      NODE_ENV: 'production',
      CORS_ORIGINS: 'https://app.example.com, https://admin.example.com',
      CSRF_SECRET: 'um-segredo-de-teste-com-mais-de-32-caracteres',
    });

    expect(corsOriginFor(environment)).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ]);
  });

  it('rejeita segredo CSRF curto em produção', () => {
    expect(() =>
      validateEnvironment({
        DATABASE_URL: databaseUrl,
        NODE_ENV: 'production',
        CORS_ORIGINS: 'https://app.example.com',
        CSRF_SECRET: 'curto',
      }),
    ).toThrow('CSRF_SECRET must contain at least 32 characters.');
  });

  it('allows only localhost origins outside production', () => {
    const environment = validateEnvironment({
      DATABASE_URL: databaseUrl,
      NODE_ENV: 'test',
    });
    const origin = corsOriginFor(environment);

    expect(origin).toBeInstanceOf(RegExp);
    expect((origin as RegExp).test('http://localhost:5173')).toBe(true);
    expect((origin as RegExp).test('https://app.example.com')).toBe(false);
  });
});
