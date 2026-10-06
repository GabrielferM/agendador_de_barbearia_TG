import { ApiProperty } from '@nestjs/swagger';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';
import { AgendamentoRespostaDto } from './agendamento-resposta.dto';

export class ClienteAgendaBarbeiroDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
}
export class AgendamentoBarbeiroRespostaDto extends AgendamentoRespostaDto {
  @ApiProperty({ type: ClienteAgendaBarbeiroDto }) cliente!: ClienteAgendaBarbeiroDto;
}
export class ListaAgendamentosBarbeiroRespostaDto {
  @ApiProperty({ type: [AgendamentoBarbeiroRespostaDto] }) data!: AgendamentoBarbeiroRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
