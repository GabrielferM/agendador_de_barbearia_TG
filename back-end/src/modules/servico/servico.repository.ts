import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ServicoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async criar(data: Prisma.ServicoCreateInput) {
    return this.prisma.servico.create({ data });
  }

  async listar() {
    return this.prisma.servico.findMany({
      orderBy: { nome: 'asc' },
    });
  }

  async buscarPorId(id: number) {
    return this.prisma.servico.findUnique({ where: { id } });
  }

  async buscarPorNome(nome: string) {
    return this.prisma.servico.findFirst({
      where: { nome },
    });
  }

  async buscarVariosPorIds(ids: number[]) {
    return this.prisma.servico.findMany({
      where: { id: { in: ids } },
    });
  }
}
