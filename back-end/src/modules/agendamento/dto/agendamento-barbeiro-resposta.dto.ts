import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';
import { AgendamentoRespostaDto } from './agendamento-resposta.dto';

export class ClienteAgendaBarbeiroDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
}
export class AgendamentoBarbeiroRespostaDto extends AgendamentoRespostaDto {
  @ApiPropertyOptional({ nullable: true, type: String }) inicioReal?: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) fimReal?: string | null;
  @ApiProperty({ type: ClienteAgendaBarbeiroDto }) cliente!: ClienteAgendaBarbeiroDto;
}
export class ListaAgendamentosBarbeiroRespostaDto {
  @ApiProperty({ type: [AgendamentoBarbeiroRespostaDto] }) data!: AgendamentoBarbeiroRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
