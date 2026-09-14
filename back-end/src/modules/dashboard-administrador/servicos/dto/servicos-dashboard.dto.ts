import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';
import { PaginacaoDto } from '../../../../common/dto/paginacao.dto';
import { MetaPaginacaoDto } from '../../../../common/swagger/respostas.dto';

export class ConsultarServicosDashboardDto extends PaginacaoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() busca?: string;
  @ApiPropertyOptional({ enum: ['true', 'false'] })
  @IsOptional()
  @IsBooleanString()
  ativo?: string;
}

export class ServicoAdministrativoDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true }) descricao!: string | null;
  @ApiProperty() duracaoMinutos!: number;
  @ApiProperty() preco!: number;
  @ApiProperty() ativo!: boolean;
  @ApiProperty() realizadosMes!: number;
  @ApiProperty() receitaMes!: number;
}

export class ServicosDashboardRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ example: { ativos: 8, maisRealizado: 'Corte', ticketMedio: 48 } })
  indicadores!: { ativos: number; maisRealizado: string | null; ticketMedio: number };
  @ApiProperty({ type: [ServicoAdministrativoDashboardDto] })
  data!: ServicoAdministrativoDashboardDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
