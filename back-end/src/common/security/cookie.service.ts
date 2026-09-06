import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CookieOptions, Response } from 'express';
import { EnvironmentVariables } from '../../config/environment';
import { SESSAO_DURACAO_MS } from '../constants/seguranca';

@Injectable()
export class CookieService {
  readonly nomeSessao: string;
  readonly nomeCsrf: string;
  private readonly opcoesBase: CookieOptions;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    const producao = config.getOrThrow('NODE_ENV') === 'production';
    this.nomeSessao = producao ? '__Host-sessao' : 'sessao';
    this.nomeCsrf = producao ? '__Host-csrf' : 'csrf';
    this.opcoesBase = { secure: producao, sameSite: 'lax', path: '/', maxAge: SESSAO_DURACAO_MS };
  }

  definir(response: Response, tokenSessao: string, tokenCsrf: string) {
    response.cookie(this.nomeSessao, tokenSessao, { ...this.opcoesBase, httpOnly: true });
    response.cookie(this.nomeCsrf, tokenCsrf, { ...this.opcoesBase, httpOnly: false });
  }

  definirCsrf(response: Response, tokenCsrf: string) {
    response.cookie(this.nomeCsrf, tokenCsrf, { ...this.opcoesBase, httpOnly: false });
  }

  limpar(response: Response) {
    response.clearCookie(this.nomeSessao, { ...this.opcoesBase, maxAge: undefined });
    response.clearCookie(this.nomeCsrf, { ...this.opcoesBase, maxAge: undefined });
  }
}
