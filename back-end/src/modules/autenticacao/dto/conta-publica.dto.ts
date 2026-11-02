import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { SENHA_MINIMA, SENHA_MAXIMA } from '../../../common/constants/seguranca';

export class RecuperarSenhaDto {
  @ApiProperty({ maxLength: 254 })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  @MaxLength(254)
  email!: string;
}
export class RedefinirSenhaDto {
  @ApiProperty({ minLength: 43, maxLength: 43 })
  @IsString()
  @Matches(/^[A-Za-z0-9_-]{43}$/)
  token!: string;
  @ApiProperty({ format: 'password', minLength: SENHA_MINIMA, maxLength: SENHA_MAXIMA })
  @IsString()
  @MinLength(SENHA_MINIMA)
  @MaxLength(SENHA_MAXIMA)
  senha!: string;
}
export class CadastroClienteDto extends RecuperarSenhaDto {
  @ApiProperty({ minLength: 2, maxLength: 120 })
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value))
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  nome!: string;
  @ApiProperty({ maxLength: 14 })
  @IsString()
  @Matches(/^(\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/)
  cpf!: string;
  @ApiPropertyOptional({ description: 'DDD e número, somente dígitos', maxLength: 11 })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/)
  telefone?: string;
  @ApiProperty({ format: 'password', minLength: SENHA_MINIMA, maxLength: SENHA_MAXIMA })
  @IsString()
  @MinLength(SENHA_MINIMA)
  @MaxLength(SENHA_MAXIMA)
  senha!: string;
}
export class MensagemContaDto {
  @ApiProperty() mensagem!: string;
}
