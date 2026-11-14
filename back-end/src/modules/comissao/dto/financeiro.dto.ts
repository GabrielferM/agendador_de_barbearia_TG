import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, Matches, Max, Min, ValidateIf } from 'class-validator';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
export class ConsultarExtratoDto extends PaginacaoDto {
  @ApiPropertyOptional({ format: 'date' })
  @ValidateIf((_o, v: unknown) => v !== undefined)
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  inicioDe?: string;
  @ApiPropertyOptional({ format: 'date' })
  @ValidateIf((_o, v: unknown) => v !== undefined)
  @Matches(/^\d{4}-\d{2}-\d{2}$/)
  @IsDateString({ strict: true })
  inicioAte?: string;
}
export class ConfigurarPercentualDto {
  @ApiProperty({ minimum: 0, maximum: 100 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  percentual!: number;
}
export class ComissaoExtratoDto {
  @ApiProperty() id!: number;
  @ApiProperty() barbeiro!: string;
  @ApiProperty() servico!: string;
  @ApiProperty() baseCalculo!: string;
  @ApiProperty() percentualAplicado!: string;
  @ApiProperty() valorComissao!: string;
  @ApiProperty() status!: string;
  @ApiProperty() dataGeracao!: string;
  @ApiProperty({ nullable: true, type: String }) dataPagamento!: string | null;
}
export class ExtratoFinanceiroDto {
  @ApiProperty() aReceber!: string;
  @ApiProperty() previstas!: string;
  @ApiProperty() pagasNoPeriodo!: string;
  @ApiProperty() geradasNoPeriodo!: string;
  @ApiProperty() inicioDe!: string;
  @ApiProperty() inicioAte!: string;
  @ApiProperty() pagina!: number;
  @ApiProperty() totalPaginas!: number;
  @ApiProperty() total!: number;
  @ApiProperty({ type: [ComissaoExtratoDto] }) itens!: ComissaoExtratoDto[];
}
export class TaxaBarbeiroDto {
  @ApiProperty() id!: number;
  @ApiProperty() nome!: string;
  @ApiProperty({ nullable: true, type: String }) percentual!: string | null;
}
export class TaxasBarbeirosDto {
  @ApiProperty({ type: [TaxaBarbeiroDto] }) itens!: TaxaBarbeiroDto[];
  @ApiProperty() totalPaginas!: number;
  @ApiProperty() pagina!: number;
}
export class RepasseRespostaDto {
  @ApiProperty() idComissao!: number;
  @ApiProperty() valor!: string;
  @ApiProperty() dataRegistro!: string;
}
