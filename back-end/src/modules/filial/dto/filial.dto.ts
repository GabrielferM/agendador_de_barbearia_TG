import { Type } from 'class-transformer';
import { IsEmail, IsOptional, IsString, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
import { DadosEnderecoDto, AtualizarEnderecoDto } from '../../endereco/dto/endereco.dto';
export class CriarFilialDto {
  @IsString() nome!: string;
  @IsString() cnpj!: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() horarioAbertura?: string;
  @IsOptional() @IsString() horarioFechamento?: string;
  @ApiProperty({ type: () => DadosEnderecoDto })
  @ValidateNested()
  @Type(() => DadosEnderecoDto)
  endereco!: DadosEnderecoDto;
}
export class AtualizarFilialDto {
  @IsOptional() @IsString() nome?: string;
  @IsOptional() @IsString() cnpj?: string;
  @IsOptional() @IsString() telefone?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() horarioAbertura?: string;
  @IsOptional() @IsString() horarioFechamento?: string;
  @ApiPropertyOptional({ type: () => AtualizarEnderecoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AtualizarEnderecoDto)
  endereco?: AtualizarEnderecoDto;
}
export class ListarFiliaisDto extends PaginacaoDto {}
