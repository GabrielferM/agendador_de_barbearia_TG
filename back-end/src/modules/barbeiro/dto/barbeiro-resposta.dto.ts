import { StatusBarbeiro, StatusFilial, StatusUsuario } from '@prisma/client';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class UsuarioPublicoRespostaDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 2 })
  idPapel!: number;

  @ApiProperty({ example: 'Lucas Ferreira' })
  nome!: string;

  @ApiProperty({ example: 'lucas@barbearia.com' })
  email!: string;

  @ApiPropertyOptional({ example: '11999999999', nullable: true })
  telefone!: string | null;

  @ApiProperty({ enum: StatusUsuario, example: StatusUsuario.ATIVO })
  status!: StatusUsuario;

  @ApiProperty({ format: 'date-time' })
  dataCadastro!: string;

  @ApiProperty({ format: 'date-time' })
  dataAtualizacao!: string;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  ultimoAcesso!: string | null;
}

export class FilialResumoRespostaDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  idEndereco!: number;

  @ApiProperty({ example: 'Barbearia Centro' })
  nome!: string;

  @ApiProperty({ example: '12345678000190' })
  cnpj!: string;

  @ApiPropertyOptional({ example: '1133334444', nullable: true })
  telefone!: string | null;

  @ApiPropertyOptional({ example: 'centro@barbearia.com', nullable: true })
  email!: string | null;

  @ApiProperty({ enum: StatusFilial, example: StatusFilial.ATIVA })
  status!: StatusFilial;

  @ApiProperty({ format: 'date-time' })
  dataCadastro!: string;

  @ApiProperty({ format: 'date-time' })
  dataAtualizacao!: string;
}

export class BarbeiroRespostaDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 1 })
  idFilial!: number;

  @ApiProperty({ example: 'Lucas Ferreira' })
  nomeProfissional!: string;

  @ApiPropertyOptional({ example: 'Especialista em cortes clássicos.', nullable: true })
  descricao!: string | null;

  @ApiPropertyOptional({ example: 'https://images.example.com/lucas.jpg', nullable: true })
  fotoUrl!: string | null;

  @ApiPropertyOptional({ format: 'date-time', nullable: true })
  dataAdmissao!: string | null;

  @ApiProperty({ enum: StatusBarbeiro, example: StatusBarbeiro.ATIVO })
  statusProfissional!: StatusBarbeiro;

  @ApiProperty({ type: () => UsuarioPublicoRespostaDto })
  usuario!: UsuarioPublicoRespostaDto;

  @ApiProperty({ type: () => FilialResumoRespostaDto })
  filial!: FilialResumoRespostaDto;
}

export class ListaBarbeirosRespostaDto {
  @ApiProperty({ type: () => BarbeiroRespostaDto, isArray: true })
  data!: BarbeiroRespostaDto[];

  @ApiProperty({ type: () => MetaPaginacaoDto })
  meta!: MetaPaginacaoDto;
}
