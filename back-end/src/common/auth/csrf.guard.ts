import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CookieService } from '../security/cookie.service';
import { CsrfService } from '../security/csrf.service';
import { RequisicaoAutenticada } from './auth.types';
import { ROTA_SEM_CSRF } from './csrf-isento.decorator';

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cookies: CookieService,
    private readonly csrf: CsrfService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequisicaoAutenticada>();
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return true;
    if (
      this.reflector.getAllAndOverride<boolean>(ROTA_SEM_CSRF, [
        context.getHandler(),
        context.getClass(),
      ])
    )
      return true;
    const cookie = request.cookies?.[this.cookies.nomeCsrf] as string | undefined;
    const header = request.header('X-CSRF-Token');
    const sessaoId = request.usuarioAtual?.sessaoId;
    if (
      !cookie ||
      !header ||
      cookie !== header ||
      !sessaoId ||
      !this.csrf.validar(header, sessaoId)
    ) {
      throw new ForbiddenException('Token CSRF inválido ou ausente.');
    }
    return true;
  }
}
