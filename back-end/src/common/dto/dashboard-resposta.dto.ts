import { ApiProperty } from '@nestjs/swagger';

export class IndicadorDashboardDto {
  @ApiProperty() valor!: number;
  @ApiProperty() variacaoPercentual!: number;
}

export class PontoSerieDashboardDto {
  @ApiProperty() data!: string;
  @ApiProperty() valor!: number;
}

export class ServicoDashboardDto {
  @ApiProperty() nome!: string;
  @ApiProperty() quantidade!: number;
  @ApiProperty() percentual!: number;
}

export class AgendamentoResumoDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() inicio!: string;
  @ApiProperty() cliente!: string;
  @ApiProperty() barbeiro!: string;
  @ApiProperty({ type: [String] }) servicos!: string[];
  @ApiProperty() status!: string;
  @ApiProperty() total!: number;
}
