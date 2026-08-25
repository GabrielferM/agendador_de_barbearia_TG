import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class CalcularValorTotalAgendamentoService {
  execute(servicos: { preco: Prisma.Decimal }[]) {
    return servicos.reduce((total, item) => total.plus(item.preco), new Prisma.Decimal(0));
  }
}
