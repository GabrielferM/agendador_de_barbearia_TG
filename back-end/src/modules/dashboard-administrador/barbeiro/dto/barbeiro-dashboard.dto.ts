import { StatusBarbeiro } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginacaoDto } from '../../../../common/dto/paginacao.dto';
import { MetaPaginacaoDto } from '../../../../common/swagger/respostas.dto';

export class ConsultarBarbeirosDashboardDto extends PaginacaoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() busca?: string;
  @ApiPropertyOptional({ enum: StatusBarbeiro })
  @IsOptional()
  @IsEnum(StatusBarbeiro)
  status?: StatusBarbeiro;
}

export class BarbeiroDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true }) fotoUrl!: string | null;
  @ApiProperty() filial!: string;
  @ApiProperty({ enum: StatusBarbeiro }) status!: StatusBarbeiro;
  @ApiProperty() atendimentosHoje!: number;
  @ApiProperty() receitaMes!: number;
  @ApiProperty() comissoesRegistradasMes!: number;
  @ApiProperty() comissoesAPagar!: number;
}

export class BarbeirosDashboardRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ example: { ativos: 4, atendimentosMes: 270, comissoesAPagar: 3240 } })
  indicadores!: { ativos: number; atendimentosMes: number; comissoesAPagar: number };
  @ApiProperty({ type: [BarbeiroDashboardDto] }) data!: BarbeiroDashboardDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
