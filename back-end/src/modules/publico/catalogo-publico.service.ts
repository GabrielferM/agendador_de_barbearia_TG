import { Injectable } from '@nestjs/common';
import { PaginacaoDto, respostaPaginada } from '../../common/dto/paginacao.dto';
import { serializarResposta } from '../../common/utils/resposta';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CatalogoPublicoService {
  constructor(private readonly prisma: PrismaService) {}

  async servicos(query: PaginacaoDto) {
    const where = { ativo: true };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.servico.findMany({
        where,
        select: { id: true, nome: true, descricao: true, precoBase: true, duracaoMinutos: true },
        orderBy: { nome: 'asc' },
        skip: this.skip(query),
        take: query.limite,
      }),
      this.prisma.servico.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(dados), total, query.pagina, query.limite);
  }

  async barbeiros(query: PaginacaoDto) {
    const where = {
      statusProfissional: 'ATIVO' as const,
      usuario: { status: 'ATIVO' as const },
      filial: { status: 'ATIVA' as const },
    };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.barbeiro.findMany({
        where,
        select: {
          id: true,
          idFilial: true,
          nomeProfissional: true,
          descricao: true,
          fotoUrl: true,
          filial: { select: { id: true, nome: true } },
        },
        orderBy: { nomeProfissional: 'asc' },
        skip: this.skip(query),
        take: query.limite,
      }),
      this.prisma.barbeiro.count({ where }),
    ]);
    return respostaPaginada(dados, total, query.pagina, query.limite);
  }

  async filiais(query: PaginacaoDto) {
    const where = { status: 'ATIVA' as const };
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.filial.findMany({
        where,
        select: {
          id: true,
          nome: true,
          telefone: true,
          endereco: {
            select: {
              cep: true,
              logradouro: true,
              numero: true,
              complemento: true,
              bairro: true,
              cidade: true,
              estado: true,
            },
          },
        },
        orderBy: { nome: 'asc' },
        skip: this.skip(query),
        take: query.limite,
      }),
      this.prisma.filial.count({ where }),
    ]);
    return respostaPaginada(dados, total, query.pagina, query.limite);
  }

  private skip(query: PaginacaoDto) {
    return (query.pagina - 1) * query.limite;
  }
}
