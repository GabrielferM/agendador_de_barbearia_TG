import { StatusComissao } from '@prisma/client';

export const STATUS_COMISSAO_A_PAGAR: StatusComissao[] = [
  StatusComissao.PREVISTA,
  StatusComissao.LIBERADA,
];
