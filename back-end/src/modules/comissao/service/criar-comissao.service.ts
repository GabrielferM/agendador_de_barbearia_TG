import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { calcularComissao } from '../validations/gerar-comissoes-concluidas';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarComissaoDto } from '../dto/comissao.dto';
import { includeComissao } from '../constants/include-comissao';

@Injectable()
export class CriarComissaoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CriarComissaoDto) {
    return executarTransacaoSerializavel(this.prisma, async (tx) => {
      const item = await tx.agendamentoServico.findUnique({
        where: { id: dto.idAgendamentoServico },
        include: { agendamento: true },
      });
      if (!item) throw new NotFoundException('Item de agendamento não encontrado.');
      if (item.agendamento.idBarbeiro !== dto.idBarbeiro) {
        throw new ConflictException('Item não pertence ao barbeiro informado.');
      }
      if (['CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'].includes(item.agendamento.status))
        throw new ConflictException('Não é permitido criar previsão para atendimento encerrado.');
      if (!(await tx.barbeiro.findUnique({ where: { id: dto.idBarbeiro } }))) {
        throw new NotFoundException('Barbeiro não encontrado.');
      }

      const percentualAplicado = new Prisma.Decimal(dto.percentualAplicado);
      try {
        return serializarResposta(
          await tx.comissao.create({
            data: {
              idAgendamentoServico: item.id,
              idBarbeiro: dto.idBarbeiro,
              baseCalculo: item.subtotal,
              percentualAplicado,
              valorComissao: calcularComissao(item.subtotal, percentualAplicado),
              observacao: dto.observacao?.trim(),
            },
            include: includeComissao,
          }),
        );
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
          throw new ConflictException('Já existe comissão para este item.');
        }
        throw error;
      }
    });
  }
}
