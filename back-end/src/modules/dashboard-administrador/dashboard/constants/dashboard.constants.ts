import { StatusAgendamento } from '@prisma/client';

export const STATUS_AGENDAMENTO_VALIDO = { not: StatusAgendamento.CANCELADO } as const;
