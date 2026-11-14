import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { PaginacaoDto } from '../../../common/dto/paginacao.dto';
import { ConfigurarPercentualDto } from '../dto/financeiro.dto';
@Injectable()
export class ConfigurarPercentualService {
  constructor(private readonly prisma: PrismaService) {}
  async listar(query: PaginacaoDto) {
    const [itens, total] = await this.prisma.$transaction([
      this.prisma.barbeiro.findMany({
        select: { id: true, nomeProfissional: true, percentualComissao: true },
        orderBy: { id: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.barbeiro.count(),
    ]);
    return {
      itens: itens.map((b) => ({
        id: b.id,
        nome: b.nomeProfissional,
        percentual: b.percentualComissao?.toFixed(2) ?? null,
      })),
      pagina: query.pagina,
      totalPaginas: Math.ceil(total / query.limite),
    };
  }
  async execute(id: number, dto: ConfigurarPercentualDto) {
    const resultado = await this.prisma.barbeiro.updateMany({
      where: { id },
      data: { percentualComissao: dto.percentual },
    });
    if (!resultado.count) throw new NotFoundException('Barbeiro não encontrado.');
  }
}
