import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, ArrayUnique, IsArray, IsInt, Matches, Min } from 'class-validator';

export class HorariosDisponiveisDto {
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) idFilial!: number;
  @ApiProperty() @Type(() => Number) @IsInt() @Min(1) idBarbeiro!: number;
  @ApiProperty({ example: '2030-01-01' }) @Matches(/^\d{4}-\d{2}-\d{2}$/) data!: string;
  @ApiProperty({ type: [Number] })
  @Transform(({ value }: { value: unknown }) =>
    (Array.isArray(value) ? value : [value]).map(Number),
  )
  @IsArray()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  servicoIds!: number[];
}
export class HorarioDisponivelRespostaDto {
  @ApiProperty() inicio!: string;
  @ApiProperty() fim!: string;
}
export class HorariosDisponiveisRespostaDto {
  @ApiProperty() fuso!: string;
  @ApiProperty() duracaoTotalMinutos!: number;
  @ApiProperty({ example: '50.00' }) valorTotal!: string;
  @ApiProperty({ type: [HorarioDisponivelRespostaDto] }) horarios!: HorarioDisponivelRespostaDto[];
}
