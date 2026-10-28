import { StatusAgendamento } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, Min, IsDateString, IsOptional } from 'class-validator';

export class ConsultarAgendaDashboardDto {
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) idCliente?: number;
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) idBarbeiro?: number;
  @ApiPropertyOptional({ enum: StatusAgendamento })
  @IsOptional()
  @IsEnum(StatusAgendamento)
  status?: StatusAgendamento;

  @ApiPropertyOptional({ format: 'date-time', description: 'Primeiro dia do período.' })
  @IsOptional()
  @IsDateString()
  inicioDe?: string;

  @ApiPropertyOptional({ format: 'date-time', description: 'Último dia do período, inclusive.' })
  @IsOptional()
  @IsDateString()
  inicioAte?: string;
}

export class ItemAgendaDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty({ format: 'date-time' }) inicio!: string;
  @ApiProperty({ format: 'date-time' }) fim!: string;
  @ApiProperty() cliente!: string;
  @ApiProperty() barbeiro!: string;
  @ApiProperty({ type: [String] }) servicos!: string[];
  @ApiProperty({ enum: StatusAgendamento }) status!: StatusAgendamento;
  @ApiProperty() total!: number;
}

export class DiaAgendaDashboardDto {
  @ApiProperty({ format: 'date' }) data!: string;
  @ApiProperty() rotulo!: string;
  @ApiProperty({ type: [ItemAgendaDashboardDto] }) agendamentos!: ItemAgendaDashboardDto[];
}

export class AgendaDashboardRespostaDto {
  @ApiProperty({ format: 'date-time' }) geradoEm!: string;
  @ApiProperty({ example: { inicioDe: '2026-09-07', inicioAte: '2026-09-13' } })
  periodo!: { inicioDe: string; inicioAte: string };
  @ApiProperty({ example: { PENDENTE: 2, CONFIRMADO: 5 } })
  totaisPorStatus!: Record<StatusAgendamento, number>;
  @ApiProperty({ type: [DiaAgendaDashboardDto] }) dias!: DiaAgendaDashboardDto[];
}
