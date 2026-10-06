import { ApiProperty } from '@nestjs/swagger';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, Matches, Min, ValidateNested } from 'class-validator';
import { ItemAgendamentoDto } from './agendamento.dto';
export class HorariosAdministradorDto {
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) idCliente!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) idBarbeiro!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) idFilial!: number;
  @ApiProperty({ example: '2030-01-01' }) @Matches(/^\d{4}-\d{2}-\d{2}$/) data!: string;
  @ApiProperty({
    type: String,
    description: 'Array JSON de itens {idServico,quantidade,desconto}.',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return undefined;
    try {
      const itens: unknown = JSON.parse(value);
      return Array.isArray(itens) ? plainToInstance(ItemAgendamentoDto, itens) : undefined;
    } catch {
      return undefined;
    }
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  servicos!: ItemAgendamentoDto[];
}
