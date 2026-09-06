import * as bcrypt from 'bcrypt';
import { SenhaService } from './senha.service';

describe('SenhaService', () => {
  const service = new SenhaService();
  const senha = ' senha Unicode segura 🔐 ';

  it('gera e valida Argon2id preservando espaços e Unicode', async () => {
    const hash = await service.gerarHash(senha);
    expect(hash).toMatch(/^\$argon2id\$/);
    await expect(service.verificar(senha, hash)).resolves.toEqual({
      valida: true,
      precisaMigrar: false,
    });
    await expect(service.verificar(senha.trim(), hash)).resolves.toEqual({
      valida: false,
      precisaMigrar: false,
    });
  });

  it('valida bcrypt legado e sinaliza migração', async () => {
    const hash = await bcrypt.hash(senha, 4);
    await expect(service.verificar(senha, hash)).resolves.toEqual({
      valida: true,
      precisaMigrar: true,
    });
  });

  it('rejeita senha incorreta e hash desconhecido sem lançar detalhes', async () => {
    const hash = await service.gerarHash(senha);
    await expect(service.verificar('incorreta', hash)).resolves.toEqual({
      valida: false,
      precisaMigrar: false,
    });
    await expect(service.verificar(senha, 'formato-invalido')).resolves.toEqual({
      valida: false,
      precisaMigrar: false,
    });
  });
});
