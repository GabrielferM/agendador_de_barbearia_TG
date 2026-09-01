import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RemoverFilialService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const filial = await this.prisma.filial.findUnique({
      where: { id },
      include: { _count: { select: { barbeiros: true, agendamentos: true } } },
    });
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    if (filial._count.barbeiros || filial._count.agendamentos)
      throw new ConflictException('Filial possui vínculos que impedem a exclusão.');
    await this.prisma.$transaction(async (tx) => {
      await tx.filial.delete({ where: { id } });
      await tx.endereco.delete({ where: { id: filial.idEndereco } });
    });
  }
}
