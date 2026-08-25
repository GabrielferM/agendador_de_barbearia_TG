import { StatusAgendamento } from '@prisma/client';

export const transicoesStatusAgendamento: Record<StatusAgendamento, StatusAgendamento[]> = {
  AGENDADO: [StatusAgendamento.CONFIRMADO, StatusAgendamento.CANCELADO],
  CONFIRMADO: [
    StatusAgendamento.EM_ANDAMENTO,
    StatusAgendamento.CANCELADO,
    StatusAgendamento.NAO_COMPARECEU,
  ],
  EM_ANDAMENTO: [StatusAgendamento.CONCLUIDO],
  CONCLUIDO: [],
  CANCELADO: [],
  NAO_COMPARECEU: [],
};
