import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarServicosDto } from '../dto/listar-servicos.dto';

@Injectable()
export class ListarServicosService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: ListarServicosDto) {
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.servico.findMany({
        orderBy: { nome: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.servico.count(),
    ]);
    return respostaPaginada(serializarResposta(dados), total, query.pagina, query.limite);
  }
}
