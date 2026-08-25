import { ConflictException, Injectable } from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

const estadosQueOcupamHorario = [
  StatusAgendamento.AGENDADO,
  StatusAgendamento.CONFIRMADO,
  StatusAgendamento.EM_ANDAMENTO,
];

@Injectable()
export class VerificarConflitoAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(idBarbeiro: number, inicio: Date, fim: Date, excluirId?: number) {
    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        idBarbeiro,
        status: { in: estadosQueOcupamHorario },
        inicio: { lt: fim },
        fim: { gt: inicio },
        ...(excluirId ? { NOT: { id: excluirId } } : {}),
      },
    });

    if (conflito) throw new ConflictException('Barbeiro já possui agendamento neste horário.');
  }
}
