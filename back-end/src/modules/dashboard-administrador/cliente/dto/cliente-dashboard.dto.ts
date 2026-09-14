import { StatusUsuario } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginacaoDto } from '../../../../common/dto/paginacao.dto';
import { MetaPaginacaoDto } from '../../../../common/swagger/respostas.dto';

export class ConsultarClientesDashboardDto extends PaginacaoDto {
  @ApiPropertyOptional() @IsOptional() @IsString() busca?: string;
  @ApiPropertyOptional({ enum: StatusUsuario })
  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;
}

export class ClienteDashboardDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true }) telefone!: string | null;
  @ApiProperty() email!: string;
  @ApiProperty({ enum: StatusUsuario }) status!: StatusUsuario;
  @ApiProperty({ format: 'date-time', nullable: true }) ultimoAtendimento!: string | null;
  @ApiProperty({ format: 'date-time', nullable: true }) proximoHorario!: string | null;
}

export class ClientesDashboardRespostaDto {
  @ApiProperty() geradoEm!: string;
  @ApiProperty({ example: { ativos: 342, novosNoMes: 14, retornoAgendado: 27 } })
  indicadores!: { ativos: number; novosNoMes: number; retornoAgendado: number };
  @ApiProperty({ type: [ClienteDashboardDto] }) data!: ClienteDashboardDto[];
  @ApiProperty({ type: MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
