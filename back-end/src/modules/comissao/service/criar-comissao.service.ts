import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
    if (
      !Number.isFinite(dto.percentualAplicado) ||
      dto.percentualAplicado <= 0 ||
      dto.percentualAplicado > 100
    )
      throw new BadRequestException('Percentual deve ser maior que zero e no máximo 100.');
    try {
      const resultado = await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const item = await tx.agendamentoServico.findUnique({
          where: { id: dto.idAgendamentoServico },
          include: { agendamento: true, comissao: true },
        });
        if (!item) throw new NotFoundException('Item de agendamento não encontrado.');
        if (item.agendamento.idBarbeiro !== dto.idBarbeiro)
          throw new ConflictException('Item não pertence ao barbeiro informado.');
        if (item.comissao) throw new ConflictException('Já existe comissão para este item.');
        if (
          ['CANCELADO', 'NAO_COMPARECEU'].includes(item.agendamento.status) ||
          item.subtotal.lte(0)
        )
          throw new ConflictException('Atendimento ou valor do item não permite gerar comissão.');
        const percentualAplicado = new Prisma.Decimal(dto.percentualAplicado);
        return tx.comissao.create({
          data: {
            idAgendamentoServico: item.id,
            idBarbeiro: item.agendamento.idBarbeiro,
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
        ['P2002', 'P2034'].includes(erro.code)
      )
        throw new ConflictException(
          'A comissão já existe ou os dados foram alterados simultaneamente. Atualize a consulta.',
        );
      throw erro;
    }
  }
}
