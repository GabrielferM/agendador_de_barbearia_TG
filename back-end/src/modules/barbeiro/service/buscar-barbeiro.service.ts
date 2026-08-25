import { Injectable, NotFoundException } from '@nestjs/common';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarBarbeiroService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const barbeiro = await this.prisma.barbeiro.findUnique({
      where: { id },
      include: { usuario: true, filial: true },
    });
    if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
    return { ...barbeiro, usuario: semSenha(barbeiro.usuario) };
  }
}
