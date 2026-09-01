import { OrigemAgendamento, StatusAgendamento } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  ValidateNested,
} from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class ItemAgendamentoDto {
  @Type(() => Number) @IsInt() idServico!: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) quantidade = 1;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) desconto = 0;
}
export class CriarAgendamentoDto {
  @Type(() => Number) @IsInt() idCliente!: number;
  @Type(() => Number) @IsInt() idBarbeiro!: number;
  @Type(() => Number) @IsInt() idFilial!: number;
  @IsDateString() inicio!: string;
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ItemAgendamentoDto)
  @ValidateNested({ each: true })
  servicos?: ItemAgendamentoDto[];
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  servicoIds?: number[];
  @IsOptional() @IsEnum(OrigemAgendamento) origem?: OrigemAgendamento;
  @IsOptional() @IsString() observacaoCliente?: string;
  @IsOptional() @IsString() observacaoInterna?: string;
}
export class AtualizarAgendamentoDto {
  @IsOptional() @IsDateString() inicio?: string;
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => ItemAgendamentoDto)
  @ValidateNested({ each: true })
  servicos?: ItemAgendamentoDto[];
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => Number)
  @IsInt({ each: true })
  servicoIds?: number[];
  @IsOptional() @IsString() observacaoCliente?: string;
  @IsOptional() @IsString() observacaoInterna?: string;
  @IsOptional() @IsEnum(StatusAgendamento) status?: StatusAgendamento;
  @IsOptional() @IsString() motivoCancelamento?: string;
}
export class ListarAgendamentosDto extends PaginacaoDto {
  @IsOptional() @Type(() => Number) @IsInt() idCliente?: number;
  @IsOptional() @Type(() => Number) @IsInt() idBarbeiro?: number;
  @IsOptional() @Type(() => Number) @IsInt() idFilial?: number;
  @IsOptional() @IsEnum(StatusAgendamento) status?: StatusAgendamento;
  @IsOptional() @IsDateString() inicioDe?: string;
  @IsOptional() @IsDateString() inicioAte?: string;
}
export class ListarHistoricoStatusDto extends PaginacaoDto {}
export class CriarHistoricoStatusDto {
  @Type(() => Number) @IsInt() idUsuarioResponsavel!: number;
  @IsOptional() @IsEnum(StatusAgendamento) statusAnterior?: StatusAgendamento;
  @IsEnum(StatusAgendamento) statusNovo!: StatusAgendamento;
  @IsOptional() @IsString() motivo?: string;
  @IsOptional() @IsString() observacao?: string;
}
