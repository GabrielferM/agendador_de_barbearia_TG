import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginacaoDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    default: 1,
    description: 'Número da página a ser retornada.',
  })
  pagina = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    maximum: 100,
    default: 20,
    description: 'Quantidade de registros por página.',
  })
  limite = 20;
}

export function respostaPaginada<T>(dados: T[], total: number, pagina: number, limite: number) {
  return {
    data: dados,
    meta: {
      pagina,
      limite,
      total,
      totalPaginas: Math.ceil(total / limite),
    },
  };
}
