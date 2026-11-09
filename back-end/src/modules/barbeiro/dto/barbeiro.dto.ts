import { Aparar, EmailNormalizado } from '../../../common/validation/campos';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import { StatusBarbeiro } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  ValidateIf,
  IsString,
  MinLength,
  MaxLength,
  IsUrl,
  Min,
} from 'class-validator';
import { SENHA_MAXIMA, SENHA_MINIMA } from '../../../common/constants/seguranca';
import { Type } from 'class-transformer';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarBarbeiroDto {
  @Aparar() @IsString() @MinLength(2) nome!: string;
  @EmailNormalizado() @IsEmail() email!: string;
  @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha!: string;
  @Type(() => Number) @IsInt() @Min(1) idFilial!: number;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  nomeProfissional?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined) @IsString() descricao?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @Aparar()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsString()
  fotoUrl?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsDateString({ strict: true })
  dataAdmissao?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsEnum(StatusBarbeiro)
  statusProfissional?: StatusBarbeiro;
}
export class AtualizarBarbeiroDto {
  @ApiPropertyOptional({
    enum: ['ATIVO', 'INATIVO'],
    description: 'Status da conta, independente do perfil profissional.',
  })
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsIn(['ATIVO', 'INATIVO'])
  statusConta?: 'ATIVO' | 'INATIVO';
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @Aparar()
  @IsString()
  @MinLength(2)
  nome?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @EmailNormalizado()
  @IsEmail()
  email?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @MinLength(SENHA_MINIMA)
  @MaxLength(SENHA_MAXIMA)
  senha?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @Type(() => Number)
  @IsInt()
  @Min(1)
  idFilial?: number;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  nomeProfissional?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined) @IsString() descricao?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @Aparar()
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  @IsString()
  fotoUrl?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsDateString({ strict: true })
  dataAdmissao?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsEnum(StatusBarbeiro)
  statusProfissional?: StatusBarbeiro;
}
export class ListarBarbeirosDto extends PaginacaoDto {}
