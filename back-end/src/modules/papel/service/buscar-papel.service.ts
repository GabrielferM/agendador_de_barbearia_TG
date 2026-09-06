import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarPapelService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const papel = await this.prisma.papel.findUnique({ where: { id } });
    if (!papel) throw new NotFoundException('Papel não encontrado.');
    return papel;
  }
}
