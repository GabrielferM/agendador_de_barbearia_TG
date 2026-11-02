import { ApiProperty } from '@nestjs/swagger';
import { StatusFilial } from '@prisma/client';
import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class EnderecoFilialRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() cep!: string;
  @ApiProperty() logradouro!: string;
  @ApiProperty() numero!: string;
  @ApiProperty({ type: String, nullable: true }) complemento!: string | null;
  @ApiProperty() bairro!: string;
  @ApiProperty() cidade!: string;
  @ApiProperty() estado!: string;
}

export class FilialRespostaDto {
  @ApiProperty() id!: number;
  @ApiProperty() idEndereco!: number;
  @ApiProperty() nome!: string;
  @ApiProperty() cnpj!: string;
  @ApiProperty({ type: String, nullable: true }) telefone!: string | null;
  @ApiProperty({ type: String, nullable: true }) email!: string | null;
  @ApiProperty({ enum: StatusFilial }) status!: StatusFilial;
  @ApiProperty({ format: 'date-time' }) dataCadastro!: string;
  @ApiProperty({ format: 'date-time' }) dataAtualizacao!: string;
  @ApiProperty({ type: () => EnderecoFilialRespostaDto }) endereco!: EnderecoFilialRespostaDto;
}

export class ListaFiliaisRespostaDto {
  @ApiProperty({ type: () => FilialRespostaDto, isArray: true }) data!: FilialRespostaDto[];
  @ApiProperty({ type: () => MetaPaginacaoDto }) meta!: MetaPaginacaoDto;
}
