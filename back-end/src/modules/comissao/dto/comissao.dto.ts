import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusComissao } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  ValidateIf,
  Min,
  Max,
  IsString,
} from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarComissaoDto {
  @Type(() => Number) @IsInt() idAgendamentoServico!: number;
  @Type(() => Number) @IsInt() idBarbeiro!: number;
  @ApiPropertyOptional({
    minimum: 0,
    maximum: 100,
    description: 'Se informado, deve corresponder à taxa cadastrada do barbeiro.',
  })
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentualAplicado?: number;
  @IsOptional() @IsString() observacao?: string;
}
export class AtualizarComissaoDto {
  @IsOptional() @IsEnum(StatusComissao) status?: StatusComissao;
  @IsOptional() @IsDateString() dataLiberacao?: string;
  @IsOptional() @IsDateString() dataPagamento?: string;
  @IsOptional() @IsDateString() dataEstorno?: string;
  @IsOptional() @IsString() motivoEstorno?: string;
  @IsOptional() @IsString() observacao?: string;
}
export class ListarComissoesDto extends PaginacaoDto {
  @IsOptional() @Type(() => Number) @IsInt() idBarbeiro?: number;
  @IsOptional() @Type(() => Number) @IsInt() idAgendamentoServico?: number;
  @IsOptional() @IsEnum(StatusComissao) status?: StatusComissao;
}
