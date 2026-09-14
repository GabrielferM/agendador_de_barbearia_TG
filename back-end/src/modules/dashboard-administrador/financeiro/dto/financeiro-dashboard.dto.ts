import { StatusComissao } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class ConsultarFinanceiroDashboardDto {
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() inicioDe?: string;
  @ApiPropertyOptional({ format: 'date-time' }) @IsOptional() @IsDateString() inicioAte?: string;
}

export class SemanaFinanceiraDashboardDto {
  @ApiProperty({ format: 'date' }) inicio!: string;
  @ApiProperty() receita!: number;
}

export class MovimentacaoFinanceiraDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty({ format: 'date-time' }) data!: string;
  @ApiProperty() descricao!: string;
  @ApiProperty({ enum: ['Receita'] }) categoria!: 'Receita';
  @ApiProperty() valor!: number;
  @ApiProperty() status!: string;
}

export class ComissaoBarbeiroDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() barbeiro!: string;
  @ApiProperty() total!: number;
  @ApiProperty({ type: 'object', additionalProperties: { type: 'number' } })
  porStatus!: Record<StatusComissao, number>;
}

export class FinanceiroDashboardRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ example: { inicioDe: '2026-09-01', inicioAte: '2026-09-30' } })
  periodo!: { inicioDe: string; inicioAte: string };
  @ApiProperty({ example: { receita: 32480, variacaoReceitaPercentual: 12, comissoes: 6496 } })
  indicadores!: { receita: number; variacaoReceitaPercentual: number; comissoes: number };
  @ApiProperty({ type: [SemanaFinanceiraDashboardDto] })
  fluxoSemanal!: SemanaFinanceiraDashboardDto[];
  @ApiProperty({ type: [MovimentacaoFinanceiraDashboardDto] })
  movimentacoesRecentes!: MovimentacaoFinanceiraDashboardDto[];
  @ApiProperty({ type: [ComissaoBarbeiroDashboardDto] })
  comissoesPorBarbeiro!: ComissaoBarbeiroDashboardDto[];
}
