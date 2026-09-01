import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';

export class CriarPapelDto {
  @IsString() @MinLength(2) codigo!: string;
  @IsString() @MinLength(2) nome!: string;
  @IsOptional() @IsString() descricao?: string;
}
export class AtualizarPapelDto {
  @IsOptional() @IsString() @MinLength(2) codigo?: string;
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsBoolean() ativo?: boolean;
}
export class ListarPapeisDto extends PaginacaoDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean() ativo?: boolean;
}
export class VincularPermissaoDto {
  @Type(() => Number) @IsInt() idPermissao!: number;
}
export class AtualizarPapelPermissaoDto {
  @IsOptional() @IsBoolean() ativo?: boolean;
}
