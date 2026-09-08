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

export class BarbeiroDesempenhoDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true, required: false }) fotoUrl?: string | null;
  @ApiProperty() atendimentos!: number;
  @ApiProperty() receita!: number;
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

export class DashboardAdministradorRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ type: IndicadorDashboardDto }) agendamentosHoje!: IndicadorDashboardDto;
  @ApiProperty({ type: IndicadorDashboardDto }) receitaHoje!: IndicadorDashboardDto;
  @ApiProperty() clientesAtivos!: number;
  @ApiProperty() novosClientesNoMes!: number;
  @ApiProperty() barbeirosAtivos!: number;
  @ApiProperty({ type: [PontoSerieDashboardDto] })
  receitaUltimosSeteDias!: PontoSerieDashboardDto[];
  @ApiProperty({ type: [ServicoDashboardDto] }) servicosNoMes!: ServicoDashboardDto[];
  @ApiProperty({ type: [BarbeiroDesempenhoDashboardDto] })
  desempenhoBarbeiros!: BarbeiroDesempenhoDashboardDto[];
  @ApiProperty({ type: [AgendamentoResumoDashboardDto] })
  agendamentosRecentes!: AgendamentoResumoDashboardDto[];
}
