import { DocumentoValido, TelefoneNormalizado, UFS } from '../../../common/validation/campos';
import { StatusFilial } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDefined,
  IsIn,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

const aparar = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class DadosEnderecoDto {
  @Transform(aparar) @IsString() @Matches(/^\d{5}-?\d{3}$/) cep!: string;
  @Transform(aparar) @IsString() @IsNotEmpty() logradouro!: string;
  @Transform(aparar) @IsString() @IsNotEmpty() numero!: string;
  @Transform(aparar) @IsOptional() @IsString() complemento?: string;
  @Transform(aparar) @IsString() @IsNotEmpty() bairro!: string;
  @Transform(aparar) @IsString() @IsNotEmpty() cidade!: string;
  @Transform(aparar)
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(UFS)
  @Length(2, 2)
  estado!: string;
}
export class AtualizarEnderecoDto {
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @Matches(/^\d{5}-?\d{3}$/)
  cep?: string;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  logradouro?: string;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  numero?: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  @Transform(aparar)
  @IsOptional()
  @IsString()
  complemento?: string | null;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  bairro?: string;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  cidade?: string;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @Length(2, 2)
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(UFS)
  estado?: string;
}
export class CriarFilialDto {
  @Transform(aparar) @IsString() @IsNotEmpty() nome!: string;
  @Transform(aparar) @IsString() @IsNotEmpty() @DocumentoValido('cnpj') cnpj!: string;
  @Transform(aparar)
  @IsOptional()
  @TelefoneNormalizado()
  @Matches(/^\d{10,11}$/)
  @IsString()
  telefone?: string;
  @Transform(aparar) @IsOptional() @IsEmail() email?: string;
  @IsDefined() @ValidateNested() @Type(() => DadosEnderecoDto) endereco!: DadosEnderecoDto;
}
export class AtualizarFilialDto {
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  nome?: string;
  @Transform(aparar)
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsString()
  @IsNotEmpty()
  @DocumentoValido('cnpj')
  cnpj?: string;
  @ApiPropertyOptional({ type: String, nullable: true })
  @Transform(aparar)
  @IsOptional()
  @IsString()
  @TelefoneNormalizado()
  @Matches(/^\d{10,11}$/)
  telefone?: string | null;
  @ApiPropertyOptional({ type: String, nullable: true })
  @Transform(aparar)
  @IsOptional()
  @IsEmail()
  email?: string | null;
  @ApiPropertyOptional({ enum: StatusFilial })
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsEnum(StatusFilial)
  status?: StatusFilial;
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsDefined()
  @ValidateNested()
  @Type(() => AtualizarEnderecoDto)
  endereco?: AtualizarEnderecoDto;
}
export class ListarFiliaisDto extends PaginacaoDto {
  @IsOptional() @IsEnum(StatusFilial) status?: StatusFilial;
}
