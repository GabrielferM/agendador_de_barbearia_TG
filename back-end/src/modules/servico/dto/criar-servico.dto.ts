import { IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CriarServicoDto {
  @IsString()
  @MinLength(2)
  nome!: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  precoBase!: number;

  @IsInt()
  @IsPositive()
  duracaoMinutos!: number;
}
