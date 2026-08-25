import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarEnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const endereco = await this.prisma.endereco.findUnique({
      where: { id },
      include: { filial: true },
    });
    if (!endereco) throw new NotFoundException('Endereço não encontrado.');
    return endereco;
  }
}
