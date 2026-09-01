import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalcularValorTotalAgendamentoService {
  execute(servicos: { precoBase: Prisma.Decimal }[]) {
    return servicos.reduce((total, item) => total.plus(item.precoBase), new Prisma.Decimal(0));
  }
}
