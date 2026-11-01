import { ApiProperty } from '@nestjs/swagger';
import {
  AgendamentoResumoDashboardDto,
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../../../common/dto/dashboard-resposta.dto';

export class IndicadorBarbeiroDto {
  @ApiProperty() valor!: number;
  @ApiProperty({
    nullable: true,
    type: Number,
    description:
      'Sem comparação percentual (null) quando o período anterior é zero e o atual positivo; ambos zero resulta em 0.',
  })
  variacaoPercentual!: number | null;
}
export class DashboardBarbeiroRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ type: IndicadorBarbeiroDto }) atendimentosHoje!: IndicadorBarbeiroDto;
  @ApiProperty({ type: IndicadorBarbeiroDto }) receitaHoje!: IndicadorBarbeiroDto;
  @ApiProperty({ type: IndicadorBarbeiroDto }) clientesNaSemana!: IndicadorBarbeiroDto;
  @ApiProperty({ type: [PontoSerieDashboardDto] })
  atendimentosUltimosSeteDias!: PontoSerieDashboardDto[];
  @ApiProperty({ type: [ServicoDashboardDto] }) servicosNoMes!: ServicoDashboardDto[];
  @ApiProperty({ type: [AgendamentoResumoDashboardDto] })
  agendaHoje!: AgendamentoResumoDashboardDto[];
  @ApiProperty({ type: [AgendamentoResumoDashboardDto] })
  proximosAgendamentos!: AgendamentoResumoDashboardDto[];
}
