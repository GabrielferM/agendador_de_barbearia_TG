import { StatusFilial } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEmail, IsEnum, IsOptional, IsString, Length, ValidateNested } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class DadosEnderecoDto {
  @IsString() @Length(8, 9) cep!: string;
  @IsString() logradouro!: string;
  @IsString() numero!: string;
  @IsOptional() @IsString() complemento?: string;
  @IsString() bairro!: string;
  @IsString() cidade!: string;
  @IsString() @Length(2, 2) estado!: string;
}
export class AtualizarEnderecoDto {
  @IsOptional() @IsString() @Length(8, 9) cep?: string;
  @IsOptional() @IsString() logradouro?: string;
  @IsOptional() @IsString() numero?: string;
  @IsOptional() @IsString() complemento?: string;
  @IsOptional() @IsString() bairro?: string;
  @IsOptional() @IsString() cidade?: string;
  @IsOptional() @IsString() @Length(2, 2) estado?: string;
}
export class CriarFilialDto {
  @IsString() nome!: string;
  @IsString() cnpj!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEmail() email?: string;
  @ValidateNested() @Type(() => DadosEnderecoDto) endereco!: DadosEnderecoDto;
}
export class AtualizarFilialDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() cnpj?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsEnum(StatusFilial) status?: StatusFilial;
  @IsOptional() @ValidateNested() @Type(() => AtualizarEnderecoDto) endereco?: AtualizarEnderecoDto;
}
export class ListarFiliaisDto extends PaginacaoDto {
  @IsOptional() @IsEnum(StatusFilial) status?: StatusFilial;
}
