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
      const barbeiro = await tx.barbeiro.findUnique({ where: { id: dto.idBarbeiro } });
      if (!barbeiro) throw new NotFoundException('Barbeiro não encontrado.');
      const percentualAplicado = barbeiro.percentualComissao;
      if (percentualAplicado === null)
        throw new ConflictException(
          'Configure o percentual de comissão do barbeiro antes de criar a previsão.',
        );
      if (
        dto.percentualAplicado !== undefined &&
        !percentualAplicado.equals(dto.percentualAplicado)
      )
        throw new ConflictException(
          'O percentual informado difere da taxa cadastrada do barbeiro.',
        );

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
