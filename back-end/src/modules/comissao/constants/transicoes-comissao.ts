import { StatusComissao } from '@prisma/client';
export const TRANSICOES_COMISSAO: Record<StatusComissao, StatusComissao[]> = {
  PREVISTA: [StatusComissao.LIBERADA, StatusComissao.CANCELADA],
  LIBERADA: [StatusComissao.PAGA, StatusComissao.CANCELADA],
  PAGA: [StatusComissao.ESTORNADA],
  CANCELADA: [],
  ESTORNADA: [],
};
