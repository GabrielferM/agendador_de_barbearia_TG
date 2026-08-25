import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarAgendamentoService } from './buscar-agendamento.service';

@Injectable()
export class RemoverAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarAgendamentoService,
  ) {}
  async execute(id: number) {
    await this.buscar.execute(id);
    await this.prisma.$transaction(async (tx) => {
      await tx.agendamentoServico.deleteMany({ where: { idAgendamento: id } });
      await tx.agendamento.delete({ where: { id } });
    });
  }
}
