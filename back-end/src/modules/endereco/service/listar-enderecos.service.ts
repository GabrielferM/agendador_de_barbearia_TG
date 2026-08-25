import { Injectable } from '@nestjs/common';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import { PrismaService } from '../../../prisma/prisma.service';
import { ListarEnderecosDto } from '../dto/endereco.dto';

@Injectable()
export class ListarEnderecosService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: ListarEnderecosDto) {
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.endereco.findMany({
        skip: (input.pagina - 1) * input.limite,
        take: input.limite,
        orderBy: { id: 'asc' },
      }),
      this.prisma.endereco.count(),
    ]);
    return respostaPaginada(dados, total, input.pagina, input.limite);
  }
}
