import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailContaService {
  constructor(private readonly config: ConfigService) {}

  async recuperar(email: string, token: string) {
    const base = this.config.get<string>('FRONTEND_URL');
    if (!base) throw new Error('Envio de e-mail indisponível.');
    // Fragmento não é enviado ao servidor web nem integra o cabeçalho Referer.
    const url = new URL('/redefinir-senha', base);
    url.hash = new URLSearchParams({ token }).toString();
    const link = url.toString();
    const texto = `Corte Certo — Redefinição de senha. O link é válido por 15 minutos. Redefinir minha senha: ${link} Se você não solicitou, ignore esta mensagem.`;
    const html = `<main lang="pt-BR"><h1>Corte Certo</h1><h2>Redefina sua senha</h2><p>Este link é válido por 15 minutos.</p><p><a href="${link}" style="background:#5C3A21;color:white;padding:12px 20px;border-radius:8px;display:inline-block">Redefinir minha senha</a></p><p>Ou copie o link: <a href="${link}">${link}</a></p><p>Se você não solicitou, ignore esta mensagem.</p></main>`;
    await this.enviar(email, 'Redefina sua senha — Corte Certo', texto, html);
  }

  async notificarAlteracao(email: string) {
    const texto =
      'Corte Certo — Sua senha foi alterada e suas sessões foram encerradas. Se você não reconhece esta ação, solicite imediatamente um novo link de recuperação.';
    await this.enviar(
      email,
      'Sua senha foi alterada — Corte Certo',
      texto,
      `<main lang="pt-BR"><h1>Corte Certo</h1><p>${texto}</p></main>`,
    );
  }

  private async enviar(email: string, subject: string, text: string, html: string) {
    const key = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    if (!key || !from) throw new Error('Envio de e-mail indisponível.');
    try {
      const resposta = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: [email], subject, text, html }),
        signal: AbortSignal.timeout(3000),
      });
      if (!resposta.ok) throw new Error();
      const dados = (await resposta.json()) as { id?: unknown };
      if (typeof dados.id !== 'string' || !dados.id) throw new Error();
    } catch {
      // Não propagar corpo, URL, destinatário ou credencial do provedor.
      throw new Error('Envio de e-mail indisponível.');
    }
  }
}
