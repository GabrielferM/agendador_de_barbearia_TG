import { StatusUsuario } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarAdministradorDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) senha!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsDateString() dataInicioAdministracao?: string;
  @IsOptional() @IsString() observacao?: string;
}

export class AtualizarAdministradorDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(8) senha?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEnum(StatusUsuario) status?: StatusUsuario;
  @IsOptional() @IsDateString() dataInicioAdministracao?: string;
  @IsOptional() @IsString() observacao?: string;
}

export class ListarAdministradoresDto extends PaginacaoDto {
  @IsOptional() @Type(() => String) @IsEnum(StatusUsuario) status?: StatusUsuario;
}
