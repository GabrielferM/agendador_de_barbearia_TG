import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength } from 'class-validator';
import { SENHA_MAXIMA } from '../../../common/constants/seguranca';

export class LoginDto {
  @ApiProperty({ example: 'cliente@barbeariaexemplo.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ format: 'password', minLength: 1, maxLength: SENHA_MAXIMA })
  @IsString()
  @MaxLength(SENHA_MAXIMA)
  senha!: string;
}

export class UsuarioSessaoDto {
  id!: number;
  nome!: string;
  email!: string;
  papel!: string;
  permissoes!: string[];
}

export class AutenticacaoRespostaDto {
  usuario!: UsuarioSessaoDto;
}
