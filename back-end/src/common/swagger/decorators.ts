import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCookieAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiParam,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErroRespostaDto, LimiteRequisicoesRespostaDto } from './respostas.dto';

export const ApiIdParam = () =>
  ApiParam({
    name: 'id',
    type: Number,
    example: 1,
    description: 'Identificador numérico do recurso.',
  });

export const ApiCrudErrors = () =>
  applyDecorators(
    ApiBadRequestResponse({ type: ErroRespostaDto, description: 'Dados de entrada inválidos.' }),
    ApiNotFoundResponse({ type: ErroRespostaDto, description: 'Recurso não encontrado.' }),
    ApiConflictResponse({
      type: ErroRespostaDto,
      description: 'Conflito com regra de negócio ou unicidade.',
    }),
  );

export const ApiErrosAutenticados = () =>
  applyDecorators(
    ApiCookieAuth('sessao'),
    ApiUnauthorizedResponse({
      type: ErroRespostaDto,
      description: 'Sessão ausente, inválida ou expirada.',
    }),
    ApiForbiddenResponse({
      type: ErroRespostaDto,
      description: 'Permissão, propriedade do recurso ou token CSRF inválido.',
    }),
    ApiTooManyRequestsResponse({
      type: LimiteRequisicoesRespostaDto,
      description: 'Limite de requisições excedido.',
    }),
  );
