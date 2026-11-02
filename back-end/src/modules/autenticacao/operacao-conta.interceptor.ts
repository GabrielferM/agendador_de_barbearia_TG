import {
  CallHandler,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NestInterceptor,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';

// Rotas anônimas sem cookies de autenticação: origem + JSON substituem apenas
// nelas o CSRF vinculado a uma sessão, que ainda não existe.
@Injectable()
export class OperacaoContaInterceptor implements NestInterceptor {
  constructor(private readonly config: ConfigService) {}
  intercept(context: ExecutionContext, next: CallHandler) {
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    http.getResponse<Response>().setHeader('Cache-Control', 'no-store');
    if (request.headers['content-type']?.split(';')[0].trim().toLowerCase() !== 'application/json')
      throw new UnsupportedMediaTypeException('Use application/json.');
    const origin = request.headers.origin;
    const producao = this.config.get<string>('NODE_ENV') === 'production';
    const permitida =
      origin &&
      (producao
        ? this.config.get<string[]>('CORS_ORIGINS', []).includes(origin)
        : /^https?:\/\/localhost(?::\d+)?$/.test(origin));
    if ((origin || producao) && !permitida)
      throw new ForbiddenException('Origem da requisição não permitida.');
    return next.handle();
  }
}
