import { StatusBarbeiro } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarBarbeiroDto {
  @IsString() @MinLength(2) nome!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) senha!: string;
  @Type(() => Number) @IsInt() idFilial!: number;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsDateString() dataAdmissao?: string;
  @IsOptional() @IsEnum(StatusBarbeiro) status?: StatusBarbeiro;
}
export class AtualizarBarbeiroDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MinLength(8) senha?: string;
  @IsOptional() @Type(() => Number) @IsInt() idFilial?: number;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsDateString() dataAdmissao?: string;
  @IsOptional() @IsEnum(StatusBarbeiro) status?: StatusBarbeiro;
}
export class ListarBarbeirosDto extends PaginacaoDto {}
