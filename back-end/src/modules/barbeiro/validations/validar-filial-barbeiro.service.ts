import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidarFilialBarbeiroService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(idFilial: number) {
    if (!(await this.prisma.filial.findUnique({ where: { id: idFilial } })))
      throw new NotFoundException('Filial não encontrada.');
  }
}
