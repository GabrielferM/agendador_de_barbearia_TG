import { IsOptional, IsString, Length } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class DadosEnderecoDto {
  @IsString() @Length(8, 9) cep!: string;
  @IsString() logradouro!: string;
  @IsString() numero!: string;
  @IsString() bairro!: string;
  @IsString() cidade!: string;
  @IsString() @Length(2, 2) estado!: string;
}
export class CriarEnderecoDto extends DadosEnderecoDto {}
export class AtualizarEnderecoDto {
  @IsOptional() @IsString() @Length(8, 9) cep?: string;
  @IsOptional() @IsString() logradouro?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() @Length(2, 2) estado?: string;
}
export class ListarEnderecosDto extends PaginacaoDto {}
