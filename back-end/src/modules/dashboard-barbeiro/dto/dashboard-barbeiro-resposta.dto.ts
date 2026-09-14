import { ApiProperty } from '@nestjs/swagger';
import {
  AgendamentoResumoDashboardDto,
  IndicadorDashboardDto,
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../../../common/dto/dashboard-resposta.dto';

export class DashboardBarbeiroRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ type: IndicadorDashboardDto }) atendimentosHoje!: IndicadorDashboardDto;
  @ApiProperty({ type: IndicadorDashboardDto }) receitaHoje!: IndicadorDashboardDto;
  @ApiProperty({ type: IndicadorDashboardDto }) clientesNaSemana!: IndicadorDashboardDto;
  @ApiProperty({ type: [PontoSerieDashboardDto] })
  atendimentosUltimosSeteDias!: PontoSerieDashboardDto[];
  @ApiProperty({ type: [ServicoDashboardDto] }) servicosNoMes!: ServicoDashboardDto[];
  @ApiProperty({ type: [AgendamentoResumoDashboardDto] })
  agendaHoje!: AgendamentoResumoDashboardDto[];
  @ApiProperty({ type: [AgendamentoResumoDashboardDto] })
  proximosAgendamentos!: AgendamentoResumoDashboardDto[];
}
