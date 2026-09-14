import { StatusAgendamento, StatusComissao } from '@prisma/client';

export const LIMITE_DIAS_FINANCEIRO = 366;
export const STATUS_RECEITA = StatusAgendamento.CONCLUIDO;
export const STATUS_COMISSAO = Object.values(StatusComissao);
