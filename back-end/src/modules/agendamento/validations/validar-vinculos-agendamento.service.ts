import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, StatusBarbeiro } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidarVinculosAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    idCliente: number,
    idBarbeiro: number,
    idFilial: number,
    prisma: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const [cliente, barbeiro, filial] = await Promise.all([
      prisma.cliente.findUnique({ where: { id: idCliente } }),
      prisma.barbeiro.findUnique({ where: { id: idBarbeiro } }),
      prisma.filial.findUnique({ where: { id: idFilial } }),
    ]);

    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    if (barbeiro.statusProfissional !== StatusBarbeiro.ATIVO)
      throw new ConflictException('Barbeiro inativo.');
    if (barbeiro.idFilial !== idFilial)
      throw new ConflictException('Barbeiro não pertence à filial informada.');
  }
}
