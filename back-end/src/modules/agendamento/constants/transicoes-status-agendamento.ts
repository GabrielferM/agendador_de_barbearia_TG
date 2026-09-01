import { StatusAgendamento } from '@prisma/client';

export const transicoesStatusAgendamento: Record<StatusAgendamento, StatusAgendamento[]> = {
  PENDENTE: [StatusAgendamento.CONFIRMADO, StatusAgendamento.CANCELADO],
  CONFIRMADO: [
    StatusAgendamento.EM_ATENDIMENTO,
    StatusAgendamento.CANCELADO,
    StatusAgendamento.NAO_COMPARECEU,
  ],
  EM_ATENDIMENTO: [StatusAgendamento.CONCLUIDO],
  CONCLUIDO: [],
  CANCELADO: [],
  NAO_COMPARECEU: [],
};
