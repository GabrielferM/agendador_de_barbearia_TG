import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class MetaPaginacaoDto {
  @ApiProperty({ example: 1 }) pagina!: number;
  @ApiProperty({ example: 20 }) limite!: number;
  @ApiProperty({ example: 42 }) total!: number;
  @ApiProperty({ example: 3 }) totalPaginas!: number;
}

export function criarRespostaPaginadaDto<T>(modelo: Type<T>) {
  class RespostaPaginadaDto {
    @ApiProperty({ type: () => modelo, isArray: true })
    data!: T[];

    @ApiProperty({ type: () => MetaPaginacaoDto })
    meta!: MetaPaginacaoDto;
  }
  return RespostaPaginadaDto;
}

export class ErroRespostaDto {
  @ApiProperty({ example: 409 }) statusCode!: number;
  @ApiProperty({ example: 'Conflito de regra de negócio.' }) message!: string | string[];
  @ApiProperty({ example: 'Conflict' }) error!: string;
}
