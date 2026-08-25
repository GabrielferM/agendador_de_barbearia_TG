import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarClientesDto } from '../dto/cliente.dto';

@Injectable()
export class ListarClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListarClientesDto) {
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        include: { usuario: true },
        orderBy: { id: 'asc' },
        skip: (input.pagina - 1) * input.limite,
        take: input.limite,
      }),
      this.prisma.cliente.count(),
    ]);
    return respostaPaginada(
      dados.map((cliente) => ({ ...cliente, usuario: semSenha(cliente.usuario) })),
      total,
      input.pagina,
      input.limite,
    );
  }
}
