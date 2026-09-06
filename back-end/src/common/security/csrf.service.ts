import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { EnvironmentVariables } from '../../config/environment';

@Injectable()
export class CsrfService {
  private readonly segredo: string;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.segredo = config.getOrThrow('CSRF_SECRET');
  }

  criar(sessaoId: string): string {
    const aleatorio = randomBytes(32).toString('base64url');
    return `${aleatorio}.${this.assinar(sessaoId, aleatorio)}`;
  }

  validar(token: string, sessaoId: string): boolean {
    const [aleatorio, assinatura, extra] = token.split('.');
    if (!aleatorio || !assinatura || extra) return false;
    const esperado = Buffer.from(this.assinar(sessaoId, aleatorio));
    const recebido = Buffer.from(assinatura);
    return esperado.length === recebido.length && timingSafeEqual(esperado, recebido);
  }

  private assinar(sessaoId: string, aleatorio: string): string {
    return createHmac('sha256', this.segredo)
      .update(`${sessaoId}.${aleatorio}`)
      .digest('base64url');
  }
}
