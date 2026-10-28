import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';

@Injectable()
export class RemoverAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number) {
    try {
      await executarTransacaoSerializavel(this.prisma, async (tx) => {
        const atual = await tx.agendamento.findUnique({ where: { id } });
        if (!atual) throw new NotFoundException('Agendamento não encontrado.');
        if (
          atual.status !== 'PENDENTE' ||
          (await tx.historicoStatusAgendamento.count({ where: { idAgendamento: id } }))
        )
          throw new ConflictException(
            'Agendamento com histórico ou fora de PENDENTE deve ser preservado. Use cancelamento.',
          );
        if (
          await tx.agendamentoServico.count({
            where: { idAgendamento: id, comissao: { isNot: null } },
          })
        )
          throw new ConflictException('Agendamento possui comissões vinculadas.');
        await tx.agendamento.delete({ where: { id } });
      });
    } catch (erro) {
      if (
        erro instanceof Prisma.PrismaClientKnownRequestError &&
        ['P2034', 'P2003'].includes(erro.code)
      )
        throw new ConflictException(
          'Agendamento alterado simultaneamente ou com vínculos. Atualize a agenda.',
        );
      throw erro;
    }
  }
}
