import { IsDateString, IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { SENHA_MAXIMA, SENHA_MINIMA } from '../../../common/constants/seguranca';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarClienteDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha!: string;
  @IsString() cpf!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsDateString() dataNascimento?: string;
  @IsOptional() @IsString() observacao?: string;
}
export class AtualizarClienteDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha?: string;
  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsDateString() dataNascimento?: string;
  @IsOptional() @IsString() observacao?: string;
}
export class ListarClientesDto extends PaginacaoDto {}
