import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

export const estadosQueOcupamHorario = [
  StatusAgendamento.PENDENTE,
  StatusAgendamento.CONFIRMADO,
  StatusAgendamento.EM_ATENDIMENTO,
];

export function intervalosSobrepostos(
  inicio: Date,
  fim: Date,
  outroInicio: Date,
  outroFim: Date,
): boolean {
  return inicio < outroFim && fim > outroInicio;
}

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
