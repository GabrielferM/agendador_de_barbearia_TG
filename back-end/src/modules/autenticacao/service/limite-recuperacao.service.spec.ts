import { LimiteRecuperacaoService } from './limite-recuperacao.service';
describe('Limite por e-mail', () => {
  afterEach(() => jest.restoreAllMocks());
  it('limita reenvio a 60s e três solicitações em 15 minutos, sem bloquear outro email', () => {
    let agora = 0;
    jest.spyOn(Date, 'now').mockImplementation(() => agora);
    const service = new LimiteRecuperacaoService();
    service.verificar('a@example.com');
    expect(() => service.verificar('a@example.com')).toThrow();
    service.verificar('b@example.com');
    agora += 60_000;
    service.verificar('a@example.com');
    agora += 60_000;
    service.verificar('a@example.com');
    agora += 60_000;
    expect(() => service.verificar('a@example.com')).toThrow();
    agora = 900_000;
    expect(() => service.verificar('a@example.com')).not.toThrow();
  });
});
