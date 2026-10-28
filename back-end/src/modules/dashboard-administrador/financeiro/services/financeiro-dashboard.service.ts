import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { adicionarDias, chaveDiaBarbearia } from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import { STATUS_COMISSAO, STATUS_RECEITA } from '../constants/financeiro-dashboard.constants';
import type { ConsultarFinanceiroDashboardDto } from '../dto/financeiro-dashboard.dto';
import type { ComissaoPorBarbeiroDashboard } from '../types/financeiro-dashboard.types';
import { validarPeriodoFinanceiro } from '../validator/periodo-financeiro.validator';

function somar(valores: (Prisma.Decimal | number | string)[]): number {
  return valores
    .reduce<Prisma.Decimal>((total, valor) => total.plus(valor), new Prisma.Decimal(0))
    .toDecimalPlaces(2, Prisma.Decimal.ROUND_HALF_UP)
    .toNumber();
}

function variacao(atual: number, anterior: number) {
  if (anterior === 0) return atual === 0 ? 0 : 100;
  return Math.round(((atual - anterior) / anterior) * 100);
}

@Injectable()
export class FinanceiroDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(query: ConsultarFinanceiroDashboardDto) {
    const agora = new Date();
    const periodo = validarPeriodoFinanceiro(query, agora);
    const [atendimentos, itensAnteriores, comissoes] = await this.prisma.$transaction([
      this.prisma.agendamento.findMany({
        where: {
          status: STATUS_RECEITA,
          inicioPrevisto: { gte: periodo.inicio, lt: periodo.fimExclusivo },
        },
        orderBy: { inicioPrevisto: 'desc' },
        include: {
          cliente: { include: { usuario: { select: { nome: true } } } },
          servicos: { include: { servico: { select: { nome: true } } } },
        },
      }),
      this.prisma.agendamentoServico.findMany({
        where: {
          agendamento: {
            status: STATUS_RECEITA,
            inicioPrevisto: {
              gte: periodo.inicioAnterior,
              lt: periodo.fimAnteriorExclusivo,
            },
          },
        },
        select: { subtotal: true },
      }),
      this.prisma.comissao.findMany({
        where: { dataGeracao: { gte: periodo.inicio, lt: periodo.fimExclusivo } },
        include: { barbeiro: { include: { usuario: { select: { nome: true } } } } },
      }),
    ]);
    const receita = somar(atendimentos.flatMap((item) => item.servicos.map((s) => s.subtotal)));
    const receitaAnterior = somar(itensAnteriores.map((item) => item.subtotal));
    const fluxoSemanal = new Map<string, number>();
    for (let data = periodo.inicio; data < periodo.fimExclusivo; data = adicionarDias(data, 7)) {
      fluxoSemanal.set(data.toISOString().slice(0, 10), 0);
    }
    for (const item of atendimentos) {
      const diasDesdeInicio = Math.floor(
        (new Date(chaveDiaBarbearia(item.inicioPrevisto)).getTime() -
          new Date(chaveDiaBarbearia(periodo.inicio)).getTime()) /
          86_400_000,
      );
      const inicioSemana = adicionarDias(periodo.inicio, Math.floor(diasDesdeInicio / 7) * 7)
        .toISOString()
        .slice(0, 10);
      const valor = somar(item.servicos.map((servico) => servico.subtotal));
      fluxoSemanal.set(inicioSemana, somar([fluxoSemanal.get(inicioSemana) ?? 0, valor]));
    }
    const comissoesPorBarbeiro = new Map<number, ComissaoPorBarbeiroDashboard>();
    for (const item of comissoes) {
      const atual = comissoesPorBarbeiro.get(item.idBarbeiro) ?? {
        id: item.idBarbeiro,
        barbeiro: item.barbeiro.nomeProfissional || item.barbeiro.usuario.nome,
        total: 0,
        porStatus: Object.fromEntries(STATUS_COMISSAO.map((status) => [status, 0])),
      };
      const valor = Number(item.valorComissao);
      atual.total = somar([atual.total, valor]);
      atual.porStatus[item.status] = somar([atual.porStatus[item.status], valor]);
      comissoesPorBarbeiro.set(item.idBarbeiro, atual);
    }
    const totalComissoes = somar(comissoes.map((item) => item.valorComissao));
    const comissoesAPagar = somar(
      comissoes
        .filter((item) => item.status === 'PREVISTA' || item.status === 'LIBERADA')
        .map((item) => item.valorComissao),
    );

    return serializarResposta({
      geradoEm: agora.toISOString(),
      periodo: {
        inicioDe: periodo.inicio.toISOString().slice(0, 10),
        inicioAte: adicionarDias(periodo.fimExclusivo, -1).toISOString().slice(0, 10),
      },
      indicadores: {
        receita,
        variacaoReceitaPercentual: variacao(receita, receitaAnterior),
        comissoes: totalComissoes,
        comissoesAPagar,
      },
      fluxoSemanal: [...fluxoSemanal].map(([inicio, valor]) => ({ inicio, receita: valor })),
      movimentacoesRecentes: atendimentos.slice(0, 10).map((item) => ({
        id: item.id,
        data: item.inicioPrevisto,
        descricao: `${item.servicos.map((servico) => servico.servico.nome).join(' + ')} - ${item.cliente.usuario.nome}`,
        categoria: 'Receita' as const,
        valor: somar(item.servicos.map((servico) => servico.subtotal)),
        status: item.status,
      })),
      comissoesPorBarbeiro: [...comissoesPorBarbeiro.values()].sort((a, b) => b.total - a.total),
    });
  }
}
