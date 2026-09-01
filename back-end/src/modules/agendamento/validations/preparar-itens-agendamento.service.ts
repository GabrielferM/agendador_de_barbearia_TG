import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ItemAgendamentoDto } from '../dto/agendamento.dto';

@Injectable()
export class PrepararItensAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(itens?: ItemAgendamentoDto[], servicoIds?: number[]) {
    if (itens && servicoIds)
      throw new BadRequestException('Informe itens detalhados ou servicoIds, não ambos.');
    const origem =
      itens ?? servicoIds?.map((idServico) => ({ idServico, quantidade: 1, desconto: 0 }));
    if (!origem?.length) throw new BadRequestException('Informe ao menos um serviço.');
    if (new Set(origem.map((item) => item.idServico)).size !== origem.length)
      throw new BadRequestException('Serviços não podem se repetir.');
    const servicos = await this.prisma.servico.findMany({
      where: { id: { in: origem.map((item) => item.idServico) }, ativo: true },
    });
    if (servicos.length !== origem.length)
      throw new NotFoundException('Um ou mais serviços ativos não foram encontrados.');
    const porId = new Map(servicos.map((servico) => [servico.id, servico]));
    return origem.map((item, index) => {
      const servico = porId.get(item.idServico)!;
      const quantidade = item.quantidade ?? 1;
      const desconto = new Prisma.Decimal(item.desconto ?? 0);
      const bruto = servico.precoBase.mul(quantidade);
      if (desconto.greaterThan(bruto))
        throw new BadRequestException('Desconto não pode superar o valor dos serviços.');
      return {
        idServico: servico.id,
        precoAplicado: servico.precoBase,
        duracaoAplicadaMinutos: servico.duracaoMinutos,
        quantidade,
        desconto,
        subtotal: bruto.minus(desconto),
        ordemExecucao: index + 1,
      };
    });
  }
}
