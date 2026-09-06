import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarAdministradoresDto } from '../dto/administrador.dto';
import {
  apresentarAdministrador,
  includeAdministrador,
} from '../utils/apresentar-administrador.utils';

@Injectable()
export class ListarAdministradoresService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: ListarAdministradoresDto) {
    const where = query.status ? { usuario: { status: query.status } } : {};
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.administrador.findMany({
        where,
        include: includeAdministrador,
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        orderBy: { id: 'asc' },
      }),
      this.prisma.administrador.count({ where }),
    ]);
    return respostaPaginada(dados.map(apresentarAdministrador), total, query.pagina, query.limite);
  }
}
