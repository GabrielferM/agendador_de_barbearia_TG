import { IsDateString, IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarClienteDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) senha!: string;
  @IsString() cpf!: string;
  @IsOptional() @IsDateString() dataNascimento?: string;
}
export class AtualizarClienteDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(8) senha?: string;
  @IsOptional() @IsString() cpf?: string;
  @IsOptional() @IsDateString() dataNascimento?: string;
}
export class ListarClientesDto extends PaginacaoDto {}
