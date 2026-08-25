import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarFilialService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const filial = await this.prisma.filial.findUnique({
      where: { id },
      include: { endereco: true },
    });
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    return filial;
  }
}
