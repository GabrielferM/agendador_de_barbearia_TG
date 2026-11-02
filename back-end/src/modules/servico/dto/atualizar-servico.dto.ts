import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
export class AtualizarServicoDto {
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() precoBase?: number;
  @IsOptional() @IsInt() @IsPositive() duracaoMinutos?: number;
  @ApiPropertyOptional({
    description: 'Disponibilidade do serviço para novas reservas.',
    type: Boolean,
  })
  @ValidateIf((_objeto, valor: unknown) => valor !== undefined)
  @IsBoolean()
  ativo?: boolean;
}
