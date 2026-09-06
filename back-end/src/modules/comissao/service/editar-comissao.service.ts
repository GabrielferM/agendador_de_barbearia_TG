import { Injectable } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeComissao } from '../constants/include-comissao';
import { AtualizarComissaoDto } from '../dto/comissao.dto';
import { BuscarComissaoService } from './buscar-comissao.service';

@Injectable()
export class EditarComissaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarComissaoService,
  ) {}

  async execute(id: number, dto: AtualizarComissaoDto) {
    await this.buscarService.execute(id);
    return serializarResposta(
      await this.prisma.comissao.update({
        where: { id },
        data: {
          ...(dto.status ? { status: dto.status } : {}),
          ...(dto.dataLiberacao !== undefined
            ? { dataLiberacao: new Date(dto.dataLiberacao) }
            : {}),
          ...(dto.dataPagamento !== undefined
            ? { dataPagamento: new Date(dto.dataPagamento) }
            : {}),
          ...(dto.dataEstorno !== undefined ? { dataEstorno: new Date(dto.dataEstorno) } : {}),
          ...(dto.motivoEstorno !== undefined ? { motivoEstorno: dto.motivoEstorno.trim() } : {}),
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        },
        include: includeComissao,
      }),
    );
  }
}
