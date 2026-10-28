import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
export class AtualizarServicoDto {
  @ApiPropertyOptional({ description: 'Disponibilidade para novos agendamentos.' })
  @IsOptional()
  @IsBoolean()
  ativo?: boolean;
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsNumber({ maxDecimalPlaces: 2 }) @IsPositive() precoBase?: number;
  @IsOptional() @IsInt() @IsPositive() duracaoMinutos?: number;
}
