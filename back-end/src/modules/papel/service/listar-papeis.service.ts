import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarPapeisDto } from '../dto/papel.dto';

@Injectable()
export class ListarPapeisService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListarPapeisDto) {
    const where = query.ativo === undefined ? {} : { ativo: query.ativo };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.papel.findMany({
        where,
        orderBy: { codigo: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.papel.count({ where }),
    ]);
    return respostaPaginada(data, total, query.pagina, query.limite);
  }
}
