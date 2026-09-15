import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

const estadosQueOcupamHorario = [
  StatusAgendamento.PENDENTE,
  StatusAgendamento.CONFIRMADO,
  StatusAgendamento.EM_ATENDIMENTO,
];

@Injectable()
export class VerificarConflitoAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(
    idBarbeiro: number,
    inicio: Date,
    fim: Date,
    excluirId?: number,
    prisma: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const conflito = await prisma.agendamento.findFirst({
      where: {
        idBarbeiro,
        status: { in: estadosQueOcupamHorario },
        inicioPrevisto: { lt: fim },
        fimPrevisto: { gt: inicio },
        ...(excluirId ? { NOT: { id: excluirId } } : {}),
      },
    });

    if (conflito) throw new ConflictException('Barbeiro já possui agendamento neste horário.');
  }
}
