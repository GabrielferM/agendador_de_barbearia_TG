import { StatusAgendamento } from '@prisma/client';

export const STATUS_AGENDAMENTO_SEM_RETORNO: StatusAgendamento[] = [
  StatusAgendamento.CANCELADO,
  StatusAgendamento.NAO_COMPARECEU,
];

export const STATUS_PROXIMO_AGENDAMENTO = { notIn: STATUS_AGENDAMENTO_SEM_RETORNO };
