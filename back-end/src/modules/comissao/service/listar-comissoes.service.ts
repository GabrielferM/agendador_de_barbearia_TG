import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeComissao } from '../constants/include-comissao';
import { ListarComissoesDto } from '../dto/comissao.dto';

@Injectable()
export class ListarComissoesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListarComissoesDto) {
    const where = {
      ...(query.idBarbeiro ? { idBarbeiro: query.idBarbeiro } : {}),
      ...(query.idAgendamentoServico ? { idAgendamentoServico: query.idAgendamentoServico } : {}),
      ...(query.status ? { status: query.status } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.comissao.findMany({
        where,
        include: includeComissao,
        orderBy: { dataGeracao: 'desc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.comissao.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(data), total, query.pagina, query.limite);
  }
}
