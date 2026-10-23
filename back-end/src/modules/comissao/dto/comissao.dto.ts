import { StatusComissao } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Max,
} from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarComissaoDto {
  @Type(() => Number) @IsInt() @Min(1) idAgendamentoServico!: number;
  @Type(() => Number) @IsInt() @Min(1) idBarbeiro!: number;
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(100)
  percentualAplicado!: number;
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
  @IsOptional() @IsString() nomeBarbeiro?: string;
  @IsOptional() @IsString() busca?: string;
  @IsOptional() @IsDateString() inicioDe?: string;
  @IsOptional() @IsDateString() inicioAte?: string;
  @IsOptional() @Type(() => Number) @IsInt() idBarbeiro?: number;
  @IsOptional() @Type(() => Number) @IsInt() idAgendamentoServico?: number;
  @IsOptional() @IsEnum(StatusComissao) status?: StatusComissao;
}

export class ListarItensElegiveisComissaoDto extends PaginacaoDto {
  @IsOptional() @IsString() busca?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) idBarbeiro?: number;
}
