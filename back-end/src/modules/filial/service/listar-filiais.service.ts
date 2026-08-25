import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarFiliaisDto } from '../dto/filial.dto';

@Injectable()
export class ListarFiliaisService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListarFiliaisDto) {
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.filial.findMany({
        include: { endereco: true },
        skip: (input.pagina - 1) * input.limite,
        take: input.limite,
        orderBy: { id: 'asc' },
      }),
      this.prisma.filial.count(),
    ]);
    return respostaPaginada(dados, total, input.pagina, input.limite);
  }
}
