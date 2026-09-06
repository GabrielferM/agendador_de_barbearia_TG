import { CsrfService } from './csrf.service';

describe('CsrfService', () => {
  const config = { getOrThrow: () => 'segredo-de-teste-com-pelo-menos-32-caracteres' };
  const service = new CsrfService(config as never);

  it('cria token aleatório assinado e vinculado à sessão', () => {
    const primeiro = service.criar('sessao-1');
    const segundo = service.criar('sessao-1');
    expect(primeiro).not.toBe(segundo);
    expect(service.validar(primeiro, 'sessao-1')).toBe(true);
    expect(service.validar(primeiro, 'sessao-2')).toBe(false);
  });

  it('rejeita token ausente, adulterado ou malformado', () => {
    const token = service.criar('sessao-1');
    expect(service.validar('', 'sessao-1')).toBe(false);
    expect(service.validar(`${token}x`, 'sessao-1')).toBe(false);
    expect(service.validar('invalido', 'sessao-1')).toBe(false);
  });
});
