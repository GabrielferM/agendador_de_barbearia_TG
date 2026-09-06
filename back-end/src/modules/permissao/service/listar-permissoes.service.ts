import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarPermissoesDto } from '../dto/permissao.dto';

@Injectable()
export class ListarPermissoesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListarPermissoesDto) {
    const where = query.ativo === undefined ? {} : { ativo: query.ativo };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.permissao.findMany({
        where,
        orderBy: { codigo: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.permissao.count({ where }),
    ]);
    return respostaPaginada(data, total, query.pagina, query.limite);
  }
}
