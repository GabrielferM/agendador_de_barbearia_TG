import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export function calcularComissao(base: Prisma.Decimal, percentual: Prisma.Decimal) {
  if (base.isNegative() || percentual.isNegative() || percentual.greaterThan(100))
    throw new ConflictException('Base ou percentual de comissão inválido.');
  return base.mul(percentual).div(100).toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP);
}

/** Recebe exclusivamente o cliente da transação de conclusão. Não recalcula históricos. */
export async function gerarComissoesConcluidas(
  tx: Prisma.TransactionClient,
  agendamento: { idBarbeiro: number; servicos: { id: number; subtotal: Prisma.Decimal }[] },
  dataLiberacao: Date,
) {
  const barbeiro = await tx.barbeiro.findUniqueOrThrow({ where: { id: agendamento.idBarbeiro } });
  for (const item of agendamento.servicos) {
    const existente = await tx.comissao.findUnique({ where: { idAgendamentoServico: item.id } });
    if (existente) {
      if (existente.idBarbeiro !== agendamento.idBarbeiro || existente.status !== 'PREVISTA')
        throw new ConflictException('Comissão existente incompatível com a conclusão.');
      await tx.comissao.update({
        where: { id: existente.id },
        data: { status: 'LIBERADA', dataLiberacao },
      });
      continue;
    }
    if (barbeiro.percentualComissao === null)
      throw new ConflictException(
        'Configure o percentual de comissão do barbeiro antes de concluir.',
      );
    await tx.comissao.create({
      data: {
        idAgendamentoServico: item.id,
        idBarbeiro: agendamento.idBarbeiro,
        baseCalculo: item.subtotal,
        percentualAplicado: barbeiro.percentualComissao,
        valorComissao: calcularComissao(item.subtotal, barbeiro.percentualComissao),
        status: 'LIBERADA',
        dataLiberacao,
      },
    });
  }
}
