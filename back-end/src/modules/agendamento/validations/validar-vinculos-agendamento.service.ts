import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { StatusBarbeiro } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidarVinculosAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(idCliente: number, idBarbeiro: number, idFilial: number) {
    const [cliente, barbeiro, filial] = await this.prisma.$transaction([
      this.prisma.cliente.findUnique({ where: { id: idCliente } }),
      this.prisma.barbeiro.findUnique({ where: { id: idBarbeiro } }),
      this.prisma.filial.findUnique({ where: { id: idFilial } }),
    ]);

    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    if (barbeiro.status !== StatusBarbeiro.ATIVO) throw new ConflictException('Barbeiro inativo.');
    if (barbeiro.idFilial !== idFilial)
      throw new ConflictException('Barbeiro não pertence à filial informada.');
  }
}
