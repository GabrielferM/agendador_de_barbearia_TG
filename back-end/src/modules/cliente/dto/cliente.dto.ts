import { ApiPropertyOptional } from '@nestjs/swagger';
import { AniversarioValido } from '../../../common/validation/aniversario';
import {
  Aparar,
  DocumentoValido,
  EmailNormalizado,
  TelefoneNormalizado,
} from '../../../common/validation/campos';
import { StatusUsuario } from '@prisma/client';
import {
  IsEnum,
  Matches,
  IsEmail,
  ValidateIf,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { SENHA_MAXIMA, SENHA_MINIMA } from '../../../common/constants/seguranca';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarClienteDto {
  @Aparar() @IsString() @MinLength(2) nome!: string;
  @EmailNormalizado() @IsEmail() email!: string;
  @IsString() @MinLength(SENHA_MINIMA) @MaxLength(SENHA_MAXIMA) senha!: string;
  @Aparar() @DocumentoValido('cpf') @IsString() cpf!: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @TelefoneNormalizado()
  @Matches(/^(?:\d{10,11})?$/)
  @IsString()
  telefone?: string;
  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 31 })
  @AniversarioValido()
  diaAniversario?: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 12 })
  @AniversarioValido()
  mesAniversario?: number | null;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined) @IsString() observacao?: string;
}
export class AtualizarClienteDto {
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsEnum(StatusUsuario)
  status?: StatusUsuario;
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
  @Aparar()
  @DocumentoValido('cpf')
  @IsString()
  cpf?: string;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @TelefoneNormalizado()
  @Matches(/^(?:\d{10,11})?$/)
  @IsString()
  telefone?: string;
  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 31 })
  @AniversarioValido()
  diaAniversario?: number | null;
  @ApiPropertyOptional({ type: Number, nullable: true, minimum: 1, maximum: 12 })
  @AniversarioValido()
  mesAniversario?: number | null;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined) @IsString() observacao?: string;
}
export class ListarClientesDto extends PaginacaoDto {}
