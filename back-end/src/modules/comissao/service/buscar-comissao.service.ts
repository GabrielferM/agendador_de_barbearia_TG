import { Injectable, NotFoundException } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeComissao } from '../constants/include-comissao';

@Injectable()
export class BuscarComissaoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const comissao = await this.prisma.comissao.findUnique({
      where: { id },
      include: includeComissao,
    });
    if (!comissao) throw new NotFoundException('Comissão não encontrada.');
    return serializarResposta(comissao);
  }
}
