import { StatusUsuario } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { SENHA_MAXIMA, SENHA_MINIMA } from '../../../common/constants/seguranca';

import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarAdministradorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  nome!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(SENHA_MINIMA)
  @MaxLength(SENHA_MAXIMA)
  senha!: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsDateString()
  dataInicioAdministracao?: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class AtualizarAdministradorDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  nome?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(SENHA_MINIMA)
  @MaxLength(SENHA_MAXIMA)
  senha?: string;

  @IsOptional()
  @IsString()
  telefone?: string;

  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;

  @IsOptional()
  @IsDateString()
  dataInicioAdministracao?: string;

  @IsOptional()
  @IsString()
  observacao?: string;
}

export class ListarAdministradoresDto extends PaginacaoDto {
  @IsOptional()
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;
}
