import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
import { AgendamentoBarbeiroRespostaDto } from '../../agendamento/dto/agendamento-barbeiro-resposta.dto';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class ConsultarBarbeiroDto extends PaginacaoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(100) busca?: string;
  @ApiPropertyOptional({
    format: 'date',
    description: 'Dia inicial em America/Sao_Paulo; padrão: início do mês.',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  inicioDe?: string;
  @ApiPropertyOptional({
    format: 'date',
    description: 'Dia final inclusivo em America/Sao_Paulo; padrão: hoje. Máximo 366 dias.',
  })
  @IsOptional()
  @IsDateString({ strict: true })
  inicioAte?: string;
}
export class ConsultarHistoricoBarbeiroDto extends ConsultarBarbeiroDto {
  @ApiPropertyOptional({ enum: ['CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'] })
  @IsOptional()
  @IsIn(['CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'])
  status?: 'CONCLUIDO' | 'CANCELADO' | 'NAO_COMPARECEU';
  @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsInt() @Min(1) idCliente?: number;
}
export class ServicoBarbeiroDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true, type: String }) descricao!: string | null;
  @ApiProperty() precoBase!: string;
  @ApiProperty() duracaoMinutos!: number;
  @ApiProperty() ativo!: boolean;
  @ApiProperty() quantidade!: number;
  @ApiProperty() receita!: string;
}
export class ClienteBarbeiroDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true, type: String }) ultimoAtendimento!: string | null;
  @ApiProperty({ nullable: true, type: String }) proximoAgendamento!: string | null;
  @ApiProperty() atendimentosConcluidos!: number;
}
export class ServicosBarbeiroRespostaDto {
  @ApiProperty({ type: [ServicoBarbeiroDto] }) data!: ServicoBarbeiroDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
export class ClientesBarbeiroRespostaDto {
  @ApiProperty({ type: [ClienteBarbeiroDto] }) data!: ClienteBarbeiroDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
export class HistoricoBarbeiroRespostaDto {
  @ApiProperty({ type: [AgendamentoBarbeiroRespostaDto] }) data!: AgendamentoBarbeiroRespostaDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
