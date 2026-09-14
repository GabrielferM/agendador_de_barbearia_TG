import { ApiProperty } from '@nestjs/swagger';
import {
  AgendamentoResumoDashboardDto,
  IndicadorDashboardDto,
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../../../../common/dto/dashboard-resposta.dto';

export class BarbeiroDesempenhoDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true, required: false }) fotoUrl?: string | null;
  @ApiProperty() atendimentos!: number;
  @ApiProperty() receita!: number;
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
