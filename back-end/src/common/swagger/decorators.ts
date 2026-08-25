import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { ErroRespostaDto } from './respostas.dto';

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
