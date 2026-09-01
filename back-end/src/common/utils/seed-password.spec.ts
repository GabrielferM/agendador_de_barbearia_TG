import { obterSenhaSeed } from './seed-password';

describe('obterSenhaSeed', () => {
  it('rejeita senha ausente ou vazia', () => {
    expect(() => obterSenhaSeed(undefined)).toThrow('SEED_DEFAULT_PASSWORD');
    expect(() => obterSenhaSeed('   ')).toThrow('SEED_DEFAULT_PASSWORD');
  });

  it('retorna a senha fornecida sem alterá-la', () => {
    expect(obterSenhaSeed('Senha de teste')).toBe('Senha de teste');
  });
});
