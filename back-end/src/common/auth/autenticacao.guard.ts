import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CookieService } from '../security/cookie.service';
import { ROTA_PUBLICA } from './publico.decorator';
import { RequisicaoAutenticada } from './auth.types';
import { SessaoService } from '../../modules/autenticacao/service/sessao.service';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cookies: CookieService,
    private readonly sessoes: SessaoService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (
      this.reflector.getAllAndOverride<boolean>(ROTA_PUBLICA, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const request = context.switchToHttp().getRequest<RequisicaoAutenticada>();
    const token = request.cookies?.[this.cookies.nomeSessao] as string | undefined;
    if (!token) throw new UnauthorizedException('Não foi possível autenticar a sessão.');
    request.usuarioAtual = await this.sessoes.buscar(token);
    return true;
  }
}
