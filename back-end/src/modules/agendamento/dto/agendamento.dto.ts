import { StatusAgendamento } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarAgendamentoDto {
  @Type(() => Number) @IsInt() idCliente!: number;
  @Type(() => Number) @IsInt() idBarbeiro!: number;
  @Type(() => Number) @IsInt() idFilial!: number;
  @IsDateString() inicio!: string;
  @IsArray() @ArrayMinSize(1) @Type(() => Number) @IsInt({ each: true }) servicoIds!: number[];
  @IsOptional() @IsString() observacao?: string;
}
export class AtualizarAgendamentoDto {
  @IsOptional() @IsDateString() inicio?: string;
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  servicoIds?: number[];
  @IsOptional() @IsString() observacao?: string;
  @IsOptional() @IsEnum(StatusAgendamento) status?: StatusAgendamento;
}
export class ListarAgendamentosDto extends PaginacaoDto {
  @IsOptional() @Type(() => Number) @IsInt() idCliente?: number;
  @IsOptional() @Type(() => Number) @IsInt() idBarbeiro?: number;
  @IsOptional() @Type(() => Number) @IsInt() idFilial?: number;
  @IsOptional() @IsEnum(StatusAgendamento) status?: StatusAgendamento;
  @IsOptional() @IsDateString() inicioDe?: string;
  @IsOptional() @IsDateString() inicioAte?: string;
}
