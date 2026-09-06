import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class ServicoPublicoDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiPropertyOptional({ nullable: true }) descricao!: string | null;
  @ApiProperty({ example: '50.00' }) precoBase!: string;
  @ApiProperty() duracaoMinutos!: number;
}
export class ListaServicosPublicosDto {
  @ApiProperty({ type: () => ServicoPublicoDto, isArray: true }) data!: ServicoPublicoDto[];
  @ApiProperty({ type: () => MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}

export class FilialPublicaResumoDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
}
export class BarbeiroPublicoDto {
  @ApiProperty() id!: number;
  @ApiProperty() idFilial!: number;
  @ApiProperty() nomeProfissional!: string;
  @ApiPropertyOptional({ nullable: true }) descricao!: string | null;
  @ApiPropertyOptional({ nullable: true }) fotoUrl!: string | null;
  @ApiProperty({ type: () => FilialPublicaResumoDto }) filial!: FilialPublicaResumoDto;
}
export class ListaBarbeirosPublicosDto {
  @ApiProperty({ type: () => BarbeiroPublicoDto, isArray: true }) data!: BarbeiroPublicoDto[];
  @ApiProperty({ type: () => MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}

export class EnderecoPublicoDto {
  @ApiProperty() cep!: string;
  @ApiProperty() logradouro!: string;
  @ApiProperty() numero!: string;
  @ApiPropertyOptional({ nullable: true }) complemento!: string | null;
  @ApiProperty() bairro!: string;
  @ApiProperty() cidade!: string;
  @ApiProperty() estado!: string;
}
export class FilialPublicaDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiPropertyOptional({ nullable: true }) telefone!: string | null;
  @ApiProperty({ type: () => EnderecoPublicoDto }) endereco!: EnderecoPublicoDto;
}
export class ListaFiliaisPublicasDto {
  @ApiProperty({ type: () => FilialPublicaDto, isArray: true }) data!: FilialPublicaDto[];
  @ApiProperty({ type: () => MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
