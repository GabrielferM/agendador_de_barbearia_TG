import {
  adicionarDias,
  dataConsultaBarbearia,
  inicioDiaBarbearia,
} from '../../../common/utils/periodo-dashboard';
import { BadRequestException, Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeComissao } from '../constants/include-comissao';
import { ListarComissoesDto } from '../dto/comissao.dto';

@Injectable()
export class ListarComissoesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListarComissoesDto) {
    const inicio = query.inicioDe
      ? inicioDiaBarbearia(dataConsultaBarbearia(query.inicioDe))
      : undefined;
    const fim = query.inicioAte
      ? adicionarDias(inicioDiaBarbearia(dataConsultaBarbearia(query.inicioAte)), 1)
      : undefined;
    if (inicio && fim && fim <= inicio)
      throw new BadRequestException('Período de comissões inválido.');
    const where = {
      ...(query.nomeBarbeiro?.trim()
        ? {
            barbeiro: {
              nomeProfissional: {
                contains: query.nomeBarbeiro.trim(),
                mode: 'insensitive' as const,
              },
            },
          }
        : {}),
      ...(inicio || fim
        ? { dataGeracao: { ...(inicio ? { gte: inicio } : {}), ...(fim ? { lt: fim } : {}) } }
        : {}),
      ...(query.busca?.trim()
        ? {
            OR: [
              {
                barbeiro: {
                  nomeProfissional: { contains: query.busca.trim(), mode: 'insensitive' as const },
                },
              },
              {
                agendamentoServico: {
                  servico: { nome: { contains: query.busca.trim(), mode: 'insensitive' as const } },
                },
              },
              {
                agendamentoServico: {
                  agendamento: {
                    cliente: {
                      usuario: {
                        nome: { contains: query.busca.trim(), mode: 'insensitive' as const },
                      },
                    },
                  },
                },
              },
            ],
          }
        : {}),
      ...(query.idBarbeiro ? { idBarbeiro: query.idBarbeiro } : {}),
      ...(query.idAgendamentoServico ? { idAgendamentoServico: query.idAgendamentoServico } : {}),
      ...(query.status ? { status: query.status } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.comissao.findMany({
        where,
        include: includeComissao,
        orderBy: [{ dataGeracao: 'desc' }, { id: 'desc' }],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.comissao.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(data), total, query.pagina, query.limite);
  }
}
