import { Injectable, NotFoundException } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarServicoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number) {
    const servico = await this.prisma.servico.findUnique({ where: { id } });
    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    return serializarResposta(servico);
  }
}
