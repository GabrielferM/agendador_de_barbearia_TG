import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { serializarResposta } from '../../../common/utils/resposta';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { ListarItensElegiveisComissaoDto } from '../dto/comissao.dto';
@Injectable()
export class ListarItensElegiveisComissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: ListarItensElegiveisComissaoDto) {
    const where = {
      comissao: { is: null },
      subtotal: { gt: 0 },
      agendamento: {
        status: { notIn: ['CANCELADO' as const, 'NAO_COMPARECEU' as const] },
        ...(query.idBarbeiro ? { idBarbeiro: query.idBarbeiro } : {}),
        ...(query.busca?.trim()
          ? {
              OR: [
                {
                  cliente: {
                    usuario: {
                      nome: { contains: query.busca.trim(), mode: 'insensitive' as const },
                    },
                  },
                },
                {
                  barbeiro: {
                    nomeProfissional: {
                      contains: query.busca.trim(),
                      mode: 'insensitive' as const,
                    },
                  },
                },
              ],
            }
          : {}),
      },
    };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.agendamentoServico.findMany({
        where,
        include: {
          servico: { select: { nome: true } },
          agendamento: {
            select: {
              id: true,
              idBarbeiro: true,
              inicioPrevisto: true,
              cliente: { select: { usuario: { select: { nome: true } } } },
              barbeiro: { select: { nomeProfissional: true } },
            },
          },
        },
        orderBy: [{ agendamento: { inicioPrevisto: 'desc' } }, { id: 'desc' }],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.agendamentoServico.count({ where }),
    ]);
    return respostaPaginada(
      serializarResposta(
        dados.map((i) => ({
          id: i.id,
          idBarbeiro: i.agendamento.idBarbeiro,
          idAgendamento: i.agendamento.id,
          inicioPrevisto: i.agendamento.inicioPrevisto,
          cliente: i.agendamento.cliente.usuario.nome,
          barbeiro: i.agendamento.barbeiro.nomeProfissional,
          servico: i.servico.nome,
          subtotal: i.subtotal,
        })),
      ),
      total,
      query.pagina,
      query.limite,
    );
  }
}
