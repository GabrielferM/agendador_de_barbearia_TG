import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class CriarPermissaoDto {
  @IsString() @MinLength(2) codigo!: string;
  @IsString() @MinLength(2) nome!: string;
  @IsOptional() @IsString() descricao?: string;
}
export class AtualizarPermissaoDto {
  @IsOptional() @IsString() @MinLength(2) codigo?: string;
  @IsOptional() @IsString() @MinLength(2) nome?: string;
  @IsOptional() @IsString() descricao?: string;
  @IsOptional() @IsBoolean() ativo?: boolean;
}
export class ListarPermissoesDto extends PaginacaoDto {
  @IsOptional() @Type(() => Boolean) @IsBoolean() ativo?: boolean;
}
