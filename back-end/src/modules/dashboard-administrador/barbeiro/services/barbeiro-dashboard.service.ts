import { Injectable } from '@nestjs/common';
import { StatusAgendamento, StatusBarbeiro } from '@prisma/client';
import {
  adicionarDias,
  inicioDiaBarbearia,
  inicioMesBarbearia,
} from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import { STATUS_COMISSAO_A_PAGAR } from '../constants/barbeiro-dashboard.constants';
import type { ConsultarBarbeirosDashboardDto } from '../dto/barbeiro-dashboard.dto';
import type { TotaisBarbeiroDashboard } from '../types/barbeiro-dashboard.types';
import { normalizarBuscaBarbeiro } from '../validator/busca-barbeiro.validator';

@Injectable()
export class BarbeiroDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(query: ConsultarBarbeirosDashboardDto) {
    const agora = new Date();
    const hoje = inicioDiaBarbearia(agora);
    const amanha = adicionarDias(hoje, 1);
    const inicioMes = inicioMesBarbearia(agora);
    const busca = normalizarBuscaBarbeiro(query.busca);
    const where = {
      ...(query.status ? { statusProfissional: query.status } : {}),
      ...(busca
        ? {
            OR: [
              { nomeProfissional: { contains: busca, mode: 'insensitive' as const } },
              { usuario: { nome: { contains: busca, mode: 'insensitive' as const } } },
            ],
          }
        : {}),
    };
    const [barbeiros, total, ativos, atendimentosMes, comissoesAPagar] =
      await this.prisma.$transaction([
        this.prisma.barbeiro.findMany({
          where,
          orderBy: { nomeProfissional: 'asc' },
          skip: (query.pagina - 1) * query.limite,
          take: query.limite,
          include: { usuario: { select: { nome: true } }, filial: { select: { nome: true } } },
        }),
        this.prisma.barbeiro.count({ where }),
        this.prisma.barbeiro.count({
          where: { statusProfissional: StatusBarbeiro.ATIVO, usuario: { status: 'ATIVO' } },
        }),
        this.prisma.agendamento.count({
          where: {
            status: StatusAgendamento.CONCLUIDO,
            inicioPrevisto: { gte: inicioMes, lt: amanha },
          },
        }),
        this.prisma.comissao.aggregate({
          where: { status: { in: STATUS_COMISSAO_A_PAGAR } },
          _sum: { valorComissao: true },
        }),
      ]);

    const ids = barbeiros.map((item) => item.id);
    const [agendamentos, comissoes] = ids.length
      ? await this.prisma.$transaction([
          this.prisma.agendamento.findMany({
            where: {
              idBarbeiro: { in: ids },
              status: { not: StatusAgendamento.CANCELADO },
              inicioPrevisto: { gte: inicioMes, lt: amanha },
            },
            select: {
              idBarbeiro: true,
              inicioPrevisto: true,
              status: true,
              servicos: { select: { subtotal: true } },
            },
          }),
          this.prisma.comissao.findMany({
            where: { idBarbeiro: { in: ids }, dataGeracao: { gte: inicioMes, lt: amanha } },
            select: { idBarbeiro: true, valorComissao: true, status: true },
          }),
        ])
      : [[], []];
    const totais = new Map<number, TotaisBarbeiroDashboard>(
      ids.map((id) => [
        id,
        {
          atendimentosHoje: 0,
          atendimentosMes: 0,
          receitaMes: 0,
          comissoesRegistradasMes: 0,
          comissoesAPagar: 0,
        },
      ]),
    );
    for (const item of agendamentos) {
      const totalItem = totais.get(item.idBarbeiro)!;
      if (item.inicioPrevisto >= hoje) totalItem.atendimentosHoje += 1;
      if (item.status === StatusAgendamento.CONCLUIDO) {
        totalItem.atendimentosMes += 1;
        totalItem.receitaMes += item.servicos.reduce(
          (soma, servico) => soma + Number(servico.subtotal),
          0,
        );
      }
    }
    for (const item of comissoes) {
      const totalItem = totais.get(item.idBarbeiro)!;
      const valor = Number(item.valorComissao);
      totalItem.comissoesRegistradasMes += valor;
      if (STATUS_COMISSAO_A_PAGAR.includes(item.status)) totalItem.comissoesAPagar += valor;
    }

    return serializarResposta({
      geradoEm: agora.toISOString(),
      indicadores: {
        ativos,
        atendimentosMes,
        comissoesAPagar: Number(comissoesAPagar._sum.valorComissao ?? 0),
      },
      data: barbeiros.map((item) => ({
        id: item.id,
        nome: item.nomeProfissional || item.usuario.nome,
        fotoUrl: item.fotoUrl,
        filial: item.filial.nome,
        status: item.statusProfissional,
        ...totais.get(item.id)!,
      })),
      meta: {
        pagina: query.pagina,
        limite: query.limite,
        total,
        totalPaginas: Math.ceil(total / query.limite),
      },
    });
  }
}
