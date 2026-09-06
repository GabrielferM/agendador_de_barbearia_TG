import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarPermissaoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const permissao = await this.prisma.permissao.findUnique({ where: { id } });
    if (!permissao) throw new NotFoundException('Permissão não encontrada.');
    return permissao;
  }
}
