import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { executarTransacaoSerializavel } from '../../../prisma/transacao';
import { CriarHistoricoStatusDto } from '../dto/agendamento.dto';
import { ListarHistoricoStatusDto } from '../dto/agendamento.dto';

@Injectable()
export class HistoricoStatusAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(idAgendamento: number, query: ListarHistoricoStatusDto) {
    if (!(await this.prisma.agendamento.findUnique({ where: { id: idAgendamento } })))
      throw new NotFoundException('Agendamento não encontrado.');
    const where = { idAgendamento };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.historicoStatusAgendamento.findMany({
        where,
        include: { usuarioResponsavel: { select: { id: true, nome: true, email: true } } },
        orderBy: { dataAlteracao: 'desc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.historicoStatusAgendamento.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(dados), total, query.pagina, query.limite);
  }
  async criar(idAgendamento: number, dto: CriarHistoricoStatusDto) {
    return executarTransacaoSerializavel(this.prisma, async (tx) => {
      const agendamento = await tx.agendamento.findUnique({ where: { id: idAgendamento } });
      const usuario = await tx.usuario.findUnique({ where: { id: dto.idUsuarioResponsavel } });
      if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
      if (!usuario) throw new NotFoundException('Usuário responsável não encontrado.');
      if (dto.statusNovo !== agendamento.status) {
        throw new ConflictException(
          'O histórico deve refletir o estado atual. Use a atualização para transições.',
        );
      }
      const ultimo = await tx.historicoStatusAgendamento.findFirst({
        where: { idAgendamento },
        orderBy: [{ dataAlteracao: 'desc' }, { id: 'desc' }],
      });
      if (!ultimo) throw new ConflictException('Não há transição registrada para complementar.');
      if (dto.statusAnterior !== ultimo.statusAnterior || dto.statusNovo !== ultimo.statusNovo) {
        throw new ConflictException(
          'O histórico informado não corresponde à última transição registrada.',
        );
      }
      return serializarResposta(
        await tx.historicoStatusAgendamento.create({
          data: {
            idAgendamento,
            idUsuarioResponsavel: dto.idUsuarioResponsavel,
            statusAnterior: dto.statusAnterior,
            statusNovo: dto.statusNovo,
            motivo: dto.motivo?.trim(),
            observacao: dto.observacao?.trim(),
          },
          include: { usuarioResponsavel: { select: { id: true, nome: true, email: true } } },
        }),
      );
    });
  }
}
