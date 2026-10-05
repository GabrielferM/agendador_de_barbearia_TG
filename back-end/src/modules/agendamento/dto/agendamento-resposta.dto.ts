import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento } from '@prisma/client';
import { FilialPublicaDto } from '../../publico/dto/catalogo-publico.dto';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class BarbeiroAgendamentoRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() nomeProfissional!: string;
}
export class ServicoAgendamentoRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
}
export class ItemAgendamentoRespostaDto {
  @ApiProperty() idServico!: number;
  @ApiProperty() precoAplicado!: string;
  @ApiProperty() duracaoAplicadaMinutos!: number;
  @ApiProperty() quantidade!: number;
  @ApiProperty() subtotal!: string;
  @ApiProperty({ type: ServicoAgendamentoRespostaDto }) servico!: ServicoAgendamentoRespostaDto;
}
export class AgendamentoRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() inicioPrevisto!: string;
  @ApiProperty() fimPrevisto!: string;
  @ApiProperty({ enum: StatusAgendamento }) status!: StatusAgendamento;
  @ApiPropertyOptional({ nullable: true, type: String }) observacaoCliente?: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) motivoCancelamento?: string | null;
  @ApiProperty({ type: FilialPublicaDto }) filial!: FilialPublicaDto;
  @ApiProperty({ type: BarbeiroAgendamentoRespostaDto }) barbeiro!: BarbeiroAgendamentoRespostaDto;
  @ApiProperty({ type: [ItemAgendamentoRespostaDto] }) servicos!: ItemAgendamentoRespostaDto[];
}
export class ListaAgendamentosRespostaDto {
  @ApiProperty({ type: [AgendamentoRespostaDto] }) data!: AgendamentoRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
