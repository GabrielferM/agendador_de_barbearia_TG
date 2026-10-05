import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidarVinculosAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}
  async validarProfissional(
    idBarbeiro: number,
    idFilial: number,
    prisma: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const [barbeiro, filial] = await Promise.all([
      prisma.barbeiro.findUnique({
        where: { id: idBarbeiro },
        include: { usuario: { select: { status: true } } },
      }),
      prisma.filial.findUnique({ where: { id: idFilial } }),
    ]);
    if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    if (filial.status !== 'ATIVA') throw new BadRequestException('Filial inativa.');
    if (barbeiro.statusProfissional !== 'ATIVO' || barbeiro.usuario.status !== 'ATIVO')
      throw new BadRequestException('Barbeiro inativo.');
    if (barbeiro.idFilial !== idFilial)
      throw new BadRequestException('Barbeiro não pertence à filial informada.');
  }
  async execute(
    idCliente: number,
    idBarbeiro: number,
    idFilial: number,
    prisma: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const cliente = await prisma.cliente.findUnique({ where: { id: idCliente } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    await this.validarProfissional(idBarbeiro, idFilial, prisma);
  }
}
