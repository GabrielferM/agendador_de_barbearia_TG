import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { semSenha } from '../../../common/utils/resposta';
import { TipoPerfil } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarUsuariosDto } from '../dto/usuario.dto';

@Injectable()
export class ListarUsuariosService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(query: ListarUsuariosDto) {
    const where = { tipoPerfil: TipoPerfil.ADMIN };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.usuario.findMany({
        where,
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        orderBy: { id: 'asc' },
      }),
      this.prisma.usuario.count({ where }),
    ]);
    return respostaPaginada(dados.map(semSenha), total, query.pagina, query.limite);
  }
}
