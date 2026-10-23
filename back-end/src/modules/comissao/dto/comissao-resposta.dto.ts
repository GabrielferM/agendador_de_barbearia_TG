import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento, StatusComissao } from '@prisma/client';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';
export class NomeUsuarioComissaoDto {
  @ApiProperty() nome!: string;
}
export class ClienteComissaoDto {
  @ApiProperty({ type: NomeUsuarioComissaoDto }) usuario!: NomeUsuarioComissaoDto;
}
export class BarbeiroComissaoDto {
  @ApiProperty() id!: number;
  @ApiProperty() nomeProfissional!: string;
  @ApiProperty({ type: NomeUsuarioComissaoDto }) usuario!: NomeUsuarioComissaoDto;
}
export class ServicoComissaoDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
}
export class AgendamentoComissaoDto {
  @ApiProperty() id!: number;
  @ApiProperty({ format: 'date-time' }) inicioPrevisto!: string;
  @ApiProperty({ enum: StatusAgendamento }) status!: StatusAgendamento;
  @ApiProperty({ type: ClienteComissaoDto }) cliente!: ClienteComissaoDto;
}
export class ItemComissaoDto {
  @ApiProperty() id!: number;
  @ApiProperty({ type: ServicoComissaoDto }) servico!: ServicoComissaoDto;
  @ApiProperty({ type: AgendamentoComissaoDto }) agendamento!: AgendamentoComissaoDto;
}
export class ComissaoRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() idAgendamentoServico!: number;
  @ApiProperty() idBarbeiro!: number;
  @ApiProperty({ example: '50.00' }) baseCalculo!: string;
  @ApiProperty({ example: '20.00' }) percentualAplicado!: string;
  @ApiProperty({ example: '10.00' }) valorComissao!: string;
  @ApiProperty({ enum: StatusComissao }) status!: StatusComissao;
  @ApiProperty({ format: 'date-time' }) dataGeracao!: string;
  @ApiPropertyOptional({ nullable: true, type: String }) dataLiberacao!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) dataPagamento!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) dataEstorno!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) motivoEstorno!: string | null;
  @ApiPropertyOptional({ nullable: true, type: String }) observacao!: string | null;
  @ApiProperty({ type: BarbeiroComissaoDto }) barbeiro!: BarbeiroComissaoDto;
  @ApiProperty({ type: ItemComissaoDto }) agendamentoServico!: ItemComissaoDto;
}
export class ListaComissoesRespostaDto {
  @ApiProperty({ type: [ComissaoRespostaDto] }) data!: ComissaoRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
export class ItemElegivelComissaoDto {
  @ApiProperty() id!: number;
  @ApiProperty() idBarbeiro!: number;
  @ApiProperty() idAgendamento!: number;
  @ApiProperty() inicioPrevisto!: string;
  @ApiProperty() cliente!: string;
  @ApiProperty() barbeiro!: string;
  @ApiProperty() servico!: string;
  @ApiProperty() subtotal!: string;
}
export class ItensElegiveisComissaoRespostaDto {
  @ApiProperty({ type: [ItemElegivelComissaoDto] }) data!: ItemElegivelComissaoDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
