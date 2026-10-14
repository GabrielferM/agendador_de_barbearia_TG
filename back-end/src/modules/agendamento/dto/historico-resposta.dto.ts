import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento } from '@prisma/client';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';
export class ResponsavelHistoricoRespostaDto {
  @ApiProperty() nome!: string;
}
export class EventoHistoricoRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty({ enum: StatusAgendamento, nullable: true })
  statusAnterior!: StatusAgendamento | null;
  @ApiProperty({ enum: StatusAgendamento }) statusNovo!: StatusAgendamento;
  @ApiProperty({ format: 'date-time' }) dataAlteracao!: string;
  @ApiPropertyOptional({
    type: ResponsavelHistoricoRespostaDto,
    description: 'Nome para profissional/admin; omitido na resposta do cliente.',
  })
  usuarioResponsavel?: ResponsavelHistoricoRespostaDto;
}
export class HistoricoAgendamentoRespostaDto {
  @ApiProperty({ type: [EventoHistoricoRespostaDto] }) data!: EventoHistoricoRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
