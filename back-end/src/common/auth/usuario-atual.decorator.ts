import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequisicaoAutenticada } from './auth.types';

export const UsuarioAtual = createParamDecorator((_data: unknown, context: ExecutionContext) => {
  return context.switchToHttp().getRequest<RequisicaoAutenticada>().usuarioAtual;
});
