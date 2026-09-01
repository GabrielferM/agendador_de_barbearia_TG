import { Injectable, NotFoundException } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
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
    const [agendamento, usuario] = await this.prisma.$transaction([
      this.prisma.agendamento.findUnique({ where: { id: idAgendamento } }),
      this.prisma.usuario.findUnique({ where: { id: dto.idUsuarioResponsavel } }),
    ]);
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    if (!usuario) throw new NotFoundException('Usuário responsável não encontrado.');
    return serializarResposta(
      await this.prisma.historicoStatusAgendamento.create({
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
  }
}
