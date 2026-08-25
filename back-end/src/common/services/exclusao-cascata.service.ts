import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExclusaoCascataService {
  constructor(private readonly prisma: PrismaService) {}

  async usuario(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { cliente: true, barbeiro: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado.');
    await this.prisma.$transaction(async (tx) => {
      await tx.agendamento.deleteMany({ where: { OR: [{ idCliente: id }, { idBarbeiro: id }] } });
      await tx.usuario.delete({ where: { id } });
    });
  }

  async cliente(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });
    if (!cliente) throw new NotFoundException('Cliente não encontrado.');
    await this.usuario(id);
  }

  async barbeiro(id: number) {
    const barbeiro = await this.prisma.barbeiro.findUnique({ where: { id } });
    if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
    await this.usuario(id);
  }

  async filial(id: number) {
    const filial = await this.prisma.filial.findUnique({
      where: { id },
      include: { barbeiros: { select: { id: true } } },
    });
    if (!filial) throw new NotFoundException('Filial não encontrada.');
    const barbeiroIds = filial.barbeiros.map((barbeiro) => barbeiro.id);
    await this.prisma.$transaction(async (tx) => {
      await tx.agendamento.deleteMany({
        where: {
          OR: [
            { idFilial: id },
            ...(barbeiroIds.length ? [{ idBarbeiro: { in: barbeiroIds } }] : []),
          ],
        },
      });
      if (barbeiroIds.length) await tx.usuario.deleteMany({ where: { id: { in: barbeiroIds } } });
      await tx.filial.delete({ where: { id } });
      await tx.endereco.delete({ where: { id: filial.idEndereco } });
    });
  }

  async endereco(id: number) {
    const endereco = await this.prisma.endereco.findUnique({
      where: { id },
      include: { filial: true },
    });
    if (!endereco) throw new NotFoundException('Endereço não encontrado.');
    if (endereco.filial) return this.filial(endereco.filial.id);
    await this.prisma.endereco.delete({ where: { id } });
  }

  async servico(id: number) {
    const servico = await this.prisma.servico.findUnique({ where: { id } });
    if (!servico) throw new NotFoundException('Serviço não encontrado.');
    const itens = await this.prisma.agendamentoServico.findMany({
      where: { idServico: id },
      select: { idAgendamento: true },
    });
    await this.prisma.$transaction(async (tx) => {
      if (itens.length)
        await tx.agendamento.deleteMany({
          where: { id: { in: itens.map((item) => item.idAgendamento) } },
        });
      await tx.servico.delete({ where: { id } });
    });
  }
}
