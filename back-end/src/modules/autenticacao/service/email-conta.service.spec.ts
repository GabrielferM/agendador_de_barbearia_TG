import { ConfigService } from '@nestjs/config';
import { EmailContaService } from './email-conta.service';
describe('Envio Resend simulado', () => {
  afterEach(() => jest.restoreAllMocks());
  const config = new ConfigService({
    RESEND_API_KEY: 're_teste',
    EMAIL_FROM: 'contas@example.com',
    FRONTEND_URL: 'https://app.example.com',
  });
  it('usa URL confiável, fragmento, HTML/texto e timeout, sem depender de Host', async () => {
    const fetchMock = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response(JSON.stringify({ id: 'id-provedor' }), { status: 200 }));
    await new EmailContaService(config).recuperar('pessoa@example.com', 't'.repeat(43));
    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.resend.com/emails',
      expect.objectContaining({ signal: expect.any(AbortSignal) as AbortSignal }),
    );
    const opcoes = fetchMock.mock.calls[0][1]!;
    const corpo = JSON.parse(opcoes.body as string) as { text: string; html: string };
    for (const valor of [corpo.text, corpo.html])
      expect(valor).toContain('https://app.example.com/redefinir-senha#token=');
  });
  it.each([new Response('privado', { status: 500 }), new Response('{}', { status: 200 })])(
    'trata falhas sem expor resposta interna',
    async (resposta) => {
      jest.spyOn(global, 'fetch').mockResolvedValue(resposta);
      await expect(
        new EmailContaService(config).notificarAlteracao('pessoa@example.com'),
      ).rejects.toThrow('Envio de e-mail indisponível.');
    },
  );
  it('sem credenciais não simula envio', async () => {
    const fetchMock = jest.spyOn(global, 'fetch');
    await expect(
      new EmailContaService(new ConfigService()).notificarAlteracao('pessoa@example.com'),
    ).rejects.toThrow();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
