import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarAgendamentosDto } from '../dto/agendamento.dto';
import { includeAgendamento } from '../constants/include-agendamento';
import { ValidarDataHoraAgendamentoService } from '../validations/validar-data-hora-agendamento.service';

@Injectable()
export class ListarAgendamentosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarDataHora: ValidarDataHoraAgendamentoService,
  ) {}
  async execute(query: ListarAgendamentosDto) {
    const where: Prisma.AgendamentoWhereInput = {
      ...(query.idCliente ? { idCliente: query.idCliente } : {}),
      ...(query.idBarbeiro ? { idBarbeiro: query.idBarbeiro } : {}),
      ...(query.idFilial ? { idFilial: query.idFilial } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.inicioDe || query.inicioAte
        ? {
            inicio: {
              ...(query.inicioDe ? { gte: this.validarDataHora.execute(query.inicioDe) } : {}),
              ...(query.inicioAte ? { lte: this.validarDataHora.execute(query.inicioAte) } : {}),
            },
          }
        : {}),
    };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.agendamento.findMany({
        where,
        include: includeAgendamento,
        orderBy: { inicio: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.agendamento.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(dados), total, query.pagina, query.limite);
  }
}
