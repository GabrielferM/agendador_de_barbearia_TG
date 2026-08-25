import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento, StatusBarbeiro, TipoPerfil } from '@prisma/client';
import { Type } from '@nestjs/common';

export class MetaPaginacaoDto {
  @ApiProperty({ example: 1 }) pagina!: number;
  @ApiProperty({ example: 20 }) limite!: number;
  @ApiProperty({ example: 42 }) total!: number;
  @ApiProperty({ example: 3 }) totalPaginas!: number;
}

export function criarRespostaPaginadaDto<T>(modelo: Type<T>) {
  class RespostaPaginadaDto {
    @ApiProperty({ type: () => modelo, isArray: true })
    data!: T[];

    @ApiProperty({ type: () => MetaPaginacaoDto })
    meta!: MetaPaginacaoDto;
  }
  return RespostaPaginadaDto;
}

export class UsuarioRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Ana Souza' }) nome!: string;
  @ApiProperty({ example: 'ana@barbearia.com' }) email!: string;
  @ApiProperty({ enum: TipoPerfil, example: TipoPerfil.ADMIN }) tipoPerfil!: TipoPerfil;
  @ApiProperty({ example: '2026-08-24T13:00:00.000Z', format: 'date-time' }) dataCadastro!: string;
  @ApiProperty({ example: '2026-08-24T13:00:00.000Z', format: 'date-time' }) createdAt!: string;
  @ApiProperty({ example: '2026-08-24T13:00:00.000Z', format: 'date-time' }) updatedAt!: string;
}
export class ListaUsuariosRespostaDto extends criarRespostaPaginadaDto(UsuarioRespostaDto) {}

export class EnderecoRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: '01001000' }) cep!: string;
  @ApiProperty({ example: 'Praça da Sé' }) logradouro!: string;
  @ApiProperty({ example: '100' }) numero!: string;
  @ApiProperty({ example: 'Sé' }) bairro!: string;
  @ApiProperty({ example: 'São Paulo' }) cidade!: string;
  @ApiProperty({ example: 'SP' }) estado!: string;
}
export class ListaEnderecosRespostaDto extends criarRespostaPaginadaDto(EnderecoRespostaDto) {}

export class FilialRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Barbearia Centro' }) nome!: string;
  @ApiProperty({ example: '04252011000110' }) cnpj!: string;
  @ApiPropertyOptional({ example: '11999999999', nullable: true }) telefone?: string | null;
  @ApiPropertyOptional({ example: 'centro@barbearia.com', nullable: true }) email?: string | null;
  @ApiPropertyOptional({ example: '09:00', nullable: true }) horarioAbertura?: string | null;
  @ApiPropertyOptional({ example: '18:00', nullable: true }) horarioFechamento?: string | null;
  @ApiProperty({ type: () => EnderecoRespostaDto }) endereco!: EnderecoRespostaDto;
}
export class ListaFiliaisRespostaDto extends criarRespostaPaginadaDto(FilialRespostaDto) {}

export class ClienteRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: '52998224725' }) cpf!: string;
  @ApiPropertyOptional({ example: '1995-03-18T00:00:00.000Z', format: 'date-time', nullable: true })
  dataNascimento?: string | null;
  @ApiProperty({ type: () => UsuarioRespostaDto }) usuario!: UsuarioRespostaDto;
}
export class ListaClientesRespostaDto extends criarRespostaPaginadaDto(ClienteRespostaDto) {}

export class BarbeiroRespostaDto {
  @ApiProperty({ example: 2 }) id!: number;
  @ApiPropertyOptional({ example: 'Especialista em degradê', nullable: true }) descricao?:
    string | null;
  @ApiPropertyOptional({ example: '2025-02-01T00:00:00.000Z', format: 'date-time', nullable: true })
  dataAdmissao?: string | null;
  @ApiProperty({ enum: StatusBarbeiro, example: StatusBarbeiro.ATIVO }) status!: StatusBarbeiro;
  @ApiProperty({ type: () => UsuarioRespostaDto }) usuario!: UsuarioRespostaDto;
  @ApiProperty({ type: () => FilialRespostaDto }) filial!: FilialRespostaDto;
}
export class ListaBarbeirosRespostaDto extends criarRespostaPaginadaDto(BarbeiroRespostaDto) {}

export class ServicoRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: 'Corte social' }) nome!: string;
  @ApiPropertyOptional({ example: 'Corte tradicional', nullable: true }) descricao?: string | null;
  @ApiProperty({ example: '45.90', description: 'Decimal serializado como string.' })
  preco!: string;
  @ApiProperty({ example: 45 }) duracaoMinutos!: number;
}
export class ListaServicosRespostaDto extends criarRespostaPaginadaDto(ServicoRespostaDto) {}

export class AgendamentoServicoRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: '45.90' }) preco!: string;
  @ApiProperty({ example: 45 }) duracaoMinutos!: number;
  @ApiProperty({ type: () => ServicoRespostaDto }) servico!: ServicoRespostaDto;
}
export class AgendamentoRespostaDto {
  @ApiProperty({ example: 1 }) id!: number;
  @ApiProperty({ example: '2026-12-10T15:00:00.000Z', format: 'date-time' }) inicio!: string;
  @ApiProperty({ example: '2026-12-10T15:45:00.000Z', format: 'date-time' }) fim!: string;
  @ApiProperty({ enum: StatusAgendamento, example: StatusAgendamento.AGENDADO })
  status!: StatusAgendamento;
  @ApiPropertyOptional({ example: 'Cliente prefere máquina 2.', nullable: true }) observacao?:
    string | null;
  @ApiProperty({ example: '45.90' }) valorTotal!: string;
  @ApiProperty({ example: '2026-08-24T13:00:00.000Z', format: 'date-time' }) dataCriacao!: string;
  @ApiProperty({ type: () => ClienteRespostaDto }) cliente!: ClienteRespostaDto;
  @ApiProperty({ type: () => BarbeiroRespostaDto }) barbeiro!: BarbeiroRespostaDto;
  @ApiProperty({ type: () => FilialRespostaDto }) filial!: FilialRespostaDto;
  @ApiProperty({ type: () => AgendamentoServicoRespostaDto, isArray: true })
  servicos!: AgendamentoServicoRespostaDto[];
}
export class ListaAgendamentosRespostaDto extends criarRespostaPaginadaDto(
  AgendamentoRespostaDto,
) {}

export class ErroRespostaDto {
  @ApiProperty({ example: 409 }) statusCode!: number;
  @ApiProperty({ example: 'Já existe um serviço com esse nome.' }) message!: string | string[];
  @ApiProperty({ example: 'Conflict' }) error!: string;
}
