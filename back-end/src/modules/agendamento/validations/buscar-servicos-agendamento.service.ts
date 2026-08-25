import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarServicosAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(ids: number[]) {
    if (new Set(ids).size !== ids.length)
      throw new BadRequestException('Serviços não podem se repetir.');

    const servicos = await this.prisma.servico.findMany({ where: { id: { in: ids } } });
    if (servicos.length !== ids.length)
      throw new NotFoundException('Um ou mais serviços não foram encontrados.');

    return servicos;
  }
}
