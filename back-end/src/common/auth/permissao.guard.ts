import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RequisicaoAutenticada } from './auth.types';
import { PERMISSOES_EXIGIDAS } from './exigir-permissoes.decorator';

@Injectable()
export class PermissaoGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const exigidas = this.reflector.getAllAndOverride<string[]>(PERMISSOES_EXIGIDAS, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!exigidas?.length) return true;
    const usuario = context.switchToHttp().getRequest<RequisicaoAutenticada>().usuarioAtual;
    if (!usuario || !exigidas.every((item) => usuario.permissoes.includes(item))) {
      throw new ForbiddenException('Você não possui permissão para esta operação.');
    }
    return true;
  }
}
