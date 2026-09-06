import { StatusBarbeiro } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
  MaxLength,
} from 'class-validator';
import { SENHA_MAXIMA, SENHA_MINIMA } from '../../../common/constants/seguranca';
import { Type } from 'class-transformer';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarBarbeiroDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha!: string;
  @Type(() => Number) @IsInt() idFilial!: number;
  @IsOptional() @IsString() nomeProfissional?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() fotoUrl?: string;
  @IsOptional() @IsDateString() dataAdmissao?: string;
  @IsOptional() @IsEnum(StatusBarbeiro) statusProfissional?: StatusBarbeiro;
}
export class AtualizarBarbeiroDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha?: string;
  @IsOptional() @Type(() => Number) @IsInt() idFilial?: number;
  @IsOptional() @IsString() nomeProfissional?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsString() fotoUrl?: string;
  @IsOptional() @IsDateString() dataAdmissao?: string;
  @IsOptional() @IsEnum(StatusBarbeiro) statusProfissional?: StatusBarbeiro;
}
export class ListarBarbeirosDto extends PaginacaoDto {}
