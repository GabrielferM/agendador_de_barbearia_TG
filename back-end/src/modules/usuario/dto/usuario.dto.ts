import { TipoPerfil } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarUsuarioDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) senha!: string;
  @IsEnum(TipoPerfil) tipoPerfil!: TipoPerfil;
}

export class AtualizarUsuarioDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(8) senha?: string;
}

export class ListarUsuariosDto extends PaginacaoDto {}
