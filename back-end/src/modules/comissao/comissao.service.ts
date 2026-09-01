import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { respostaPaginada } from '../../common/dto/paginacao.dto';
import { serializarResposta } from '../../common/utils/resposta';
import { PrismaService } from '../../prisma/prisma.service';
import { AtualizarComissaoDto, CriarComissaoDto, ListarComissoesDto } from './dto/comissao.dto';
const includeComissao = {
  barbeiro: { include: { usuario: { select: { id: true, nome: true, email: true } } } },
  agendamentoServico: { include: { agendamento: true, servico: true } },
} as const;
@Injectable()
export class ComissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async criar(dto: CriarComissaoDto) {
    const item = await this.prisma.agendamentoServico.findUnique({
      where: { id: dto.idAgendamentoServico },
      include: { agendamento: true },
    });
    if (!item) throw new NotFoundException('Item de agendamento não encontrado.');
    if (item.agendamento.idBarbeiro !== dto.idBarbeiro)
      throw new ConflictException('Item não pertence ao barbeiro informado.');
    if (!(await this.prisma.barbeiro.findUnique({ where: { id: dto.idBarbeiro } })))
      throw new NotFoundException('Barbeiro não encontrado.');
    const percentualAplicado = new Prisma.Decimal(dto.percentualAplicado);
    try {
      return serializarResposta(
        await this.prisma.comissao.create({
          data: {
            idAgendamentoServico: item.id,
            idBarbeiro: dto.idBarbeiro,
            baseCalculo: item.subtotal,
            percentualAplicado,
            valorComissao: item.subtotal.mul(percentualAplicado).div(100),
            observacao: dto.observacao?.trim(),
          },
          include: includeComissao,
        }),
      );
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Já existe comissão para este item.');
      throw e;
    }
  }
  async listar(query: ListarComissoesDto) {
    const where = {
      ...(query.idBarbeiro ? { idBarbeiro: query.idBarbeiro } : {}),
      ...(query.idAgendamentoServico ? { idAgendamentoServico: query.idAgendamentoServico } : {}),
      ...(query.status ? { status: query.status } : {}),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.comissao.findMany({
        where,
        include: includeComissao,
        orderBy: { dataGeracao: 'desc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.comissao.count({ where }),
    ]);
    return respostaPaginada(serializarResposta(data), total, query.pagina, query.limite);
  }
  async buscar(id: number) {
    const comissao = await this.prisma.comissao.findUnique({
      where: { id },
      include: includeComissao,
    });
    if (!comissao) throw new NotFoundException('Comissão não encontrada.');
    return serializarResposta(comissao);
  }
  async atualizar(id: number, dto: AtualizarComissaoDto) {
    await this.buscar(id);
    return serializarResposta(
      await this.prisma.comissao.update({
        where: { id },
        data: {
          ...(dto.status ? { status: dto.status } : {}),
          ...(dto.dataLiberacao !== undefined
            ? { dataLiberacao: new Date(dto.dataLiberacao) }
            : {}),
          ...(dto.dataPagamento !== undefined
            ? { dataPagamento: new Date(dto.dataPagamento) }
            : {}),
          ...(dto.dataEstorno !== undefined ? { dataEstorno: new Date(dto.dataEstorno) } : {}),
          ...(dto.motivoEstorno !== undefined ? { motivoEstorno: dto.motivoEstorno.trim() } : {}),
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        },
        include: includeComissao,
      }),
    );
  }
}
