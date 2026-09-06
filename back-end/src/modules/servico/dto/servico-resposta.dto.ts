import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { MetaPaginacaoDto } from '../../../common/swagger/respostas.dto';

export class ServicoRespostaDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Corte de cabelo' })
  nome!: string;

  @ApiPropertyOptional({ example: 'Corte clássico com acabamento.', nullable: true })
  descricao!: string | null;

  @ApiProperty({
    example: '35.00',
    description: 'Valor decimal serializado como texto.',
  })
  precoBase!: string;

  @ApiProperty({ example: 30 })
  duracaoMinutos!: number;

  @ApiProperty({ example: true })
  ativo!: boolean;

  @ApiProperty({ format: 'date-time' })
  dataCadastro!: string;

  @ApiProperty({ format: 'date-time' })
  dataAtualizacao!: string;
}

export class ListaServicosRespostaDto {
  @ApiProperty({ type: () => ServicoRespostaDto, isArray: true })
  data!: ServicoRespostaDto[];

  @ApiProperty({ type: () => MetaPaginacaoDto })
  meta!: MetaPaginacaoDto;
}
