import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { CriarComissaoDto } from '../dto/comissao.dto';
import { includeComissao } from '../constants/include-comissao';

@Injectable()
export class CriarComissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(dto: CriarComissaoDto) {
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const item = await tx.agendamentoServico.findUnique({
          where: { id: dto.idAgendamentoServico },
          include: { agendamento: true },
        });
        if (!item) throw new NotFoundException('Item de agendamento não encontrado.');
        if (item.agendamento.idBarbeiro !== dto.idBarbeiro)
          throw new ConflictException('Item não pertence ao barbeiro informado.');
        if (['CANCELADO', 'NAO_COMPARECEU'].includes(item.agendamento.status))
          throw new ConflictException('Atendimento cancelado ou não realizado não gera comissão.');
        const percentualAplicado = new Prisma.Decimal(dto.percentualAplicado);
        if (percentualAplicado.lte(0) || percentualAplicado.gt(100))
          throw new ConflictException('Percentual deve ser maior que zero e até 100.');
        return tx.comissao.create({
          data: {
            idAgendamentoServico: item.id,
            idBarbeiro: dto.idBarbeiro,
            baseCalculo: item.subtotal,
            percentualAplicado,
            valorComissao: item.subtotal
              .mul(percentualAplicado)
              .div(100)
              .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP),
            observacao: dto.observacao?.trim(),
          },
          include: includeComissao,
        });
      });
      return serializarResposta(resultado);
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2002', 'P2034', 'P2003'].includes(erro.code)
      )
        throw new ConflictException(
          'Item já comissionado ou alterado simultaneamente. Atualize a consulta.',
        );
      throw erro;
    }
  }
}
