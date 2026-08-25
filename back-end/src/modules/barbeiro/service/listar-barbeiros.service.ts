import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarBarbeirosDto } from '../dto/barbeiro.dto';

@Injectable()
export class ListarBarbeirosService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListarBarbeirosDto) {
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.barbeiro.findMany({
        include: { usuario: true, filial: true },
        orderBy: { id: 'asc' },
        skip: (input.pagina - 1) * input.limite,
        take: input.limite,
      }),
      this.prisma.barbeiro.count(),
    ]);
    return respostaPaginada(
      dados.map((barbeiro) => ({ ...barbeiro, usuario: semSenha(barbeiro.usuario) })),
      total,
      input.pagina,
      input.limite,
    );
  }
}
