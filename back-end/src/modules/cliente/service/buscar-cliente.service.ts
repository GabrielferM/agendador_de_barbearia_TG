import { Injectable, NotFoundException } from '@nestjs/common';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },
      include: { usuario: true },
    });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    return { ...cliente, usuario: semSenha(cliente.usuario) };
  }
}
