import { Injectable } from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import type {
  AgendamentoResumoDashboardDto,
  IndicadorDashboardDto,
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../../../../common/dto/dashboard-resposta.dto';
import {
  adicionarDias,
  chaveDiaBarbearia,
  inicioDiaBarbearia,
  inicioMesBarbearia,
} from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import { STATUS_AGENDAMENTO_VALIDO } from '../constants/dashboard.constants';
import type { BarbeiroDesempenho } from '../types/dashboard.types';
import { calcularVariacao } from '../validator/variacao-dashboard.validator';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter() {
    const agora = new Date();
    const hoje = inicioDiaBarbearia(agora);
    const amanha = adicionarDias(hoje, 1);
    const ontem = adicionarDias(hoje, -1);
    const inicioSerie = adicionarDias(hoje, -6);
    const inicioMes = inicioMesBarbearia(agora);

    const [
      agendamentosHoje,
      agendamentosOntem,
      itensConcluidos,
      clientesAtivos,
      novosClientesNoMes,
      barbeirosAtivos,
      agendamentosRecentes,
      atendimentosConcluidosNoMes,
    ] = await this.prisma.$transaction([
      this.prisma.agendamento.count({
        where: { inicioPrevisto: { gte: hoje, lt: amanha }, status: STATUS_AGENDAMENTO_VALIDO },
      }),
      this.prisma.agendamento.count({
        where: { inicioPrevisto: { gte: ontem, lt: hoje }, status: STATUS_AGENDAMENTO_VALIDO },
      }),
      this.prisma.agendamentoServico.findMany({
        where: {
          agendamento: {
            status: StatusAgendamento.CONCLUIDO,
            inicioPrevisto: { gte: inicioSerie, lt: amanha },
          },
        },
        select: {
          subtotal: true,
          servico: { select: { id: true, nome: true } },
          agendamento: { select: { inicioPrevisto: true } },
        },
      }),
      this.prisma.cliente.count({ where: { usuario: { status: 'ATIVO' } } }),
      this.prisma.cliente.count({
        where: { usuario: { dataCadastro: { gte: inicioMes }, status: 'ATIVO' } },
      }),
      this.prisma.barbeiro.count({
        where: { statusProfissional: 'ATIVO', usuario: { status: 'ATIVO' } },
      }),
      this.prisma.agendamento.findMany({
        orderBy: { inicioPrevisto: 'desc' },
        take: 5,
        include: {
          cliente: { include: { usuario: { select: { nome: true } } } },
          barbeiro: { include: { usuario: { select: { nome: true } } } },
          servicos: { include: { servico: { select: { nome: true } } } },
        },
      }),
      this.prisma.agendamento.findMany({
        where: {
          status: StatusAgendamento.CONCLUIDO,
          inicioPrevisto: { gte: inicioMes, lt: amanha },
        },
        select: {
          idBarbeiro: true,
          barbeiro: { select: { nomeProfissional: true, fotoUrl: true } },
          servicos: { select: { subtotal: true, servico: { select: { id: true, nome: true } } } },
        },
      }),
    ]);

    const receitaPorDia = new Map<string, number>();
    for (let indice = 0; indice < 7; indice += 1) {
      receitaPorDia.set(adicionarDias(inicioSerie, indice).toISOString().slice(0, 10), 0);
    }
    for (const item of itensConcluidos) {
      const chave = chaveDiaBarbearia(item.agendamento.inicioPrevisto);
      receitaPorDia.set(chave, (receitaPorDia.get(chave) ?? 0) + Number(item.subtotal));
    }

    const chaveHoje = hoje.toISOString().slice(0, 10);
    const chaveOntem = ontem.toISOString().slice(0, 10);
    const servicos = new Map<number, { nome: string; quantidade: number }>();
    const barbeiros = new Map<number, BarbeiroDesempenho>();

    for (const atendimento of atendimentosConcluidosNoMes) {
      const atual = barbeiros.get(atendimento.idBarbeiro) ?? {
        id: atendimento.idBarbeiro,
        nome: atendimento.barbeiro.nomeProfissional,
        fotoUrl: atendimento.barbeiro.fotoUrl,
        atendimentos: 0,
        receita: 0,
      };
      atual.atendimentos += 1;
      for (const item of atendimento.servicos) {
        atual.receita += Number(item.subtotal);
        const servico = servicos.get(item.servico.id) ?? {
          nome: item.servico.nome,
          quantidade: 0,
        };
        servico.quantidade += 1;
        servicos.set(item.servico.id, servico);
      }
      barbeiros.set(atendimento.idBarbeiro, atual);
    }

    const totalServicos = [...servicos.values()].reduce(
      (total, item) => total + item.quantidade,
      0,
    );
    return serializarResposta({
      geradoEm: agora.toISOString(),
      agendamentosHoje: {
        valor: agendamentosHoje,
        variacaoPercentual: calcularVariacao(agendamentosHoje, agendamentosOntem),
      } satisfies IndicadorDashboardDto,
      receitaHoje: {
        valor: receitaPorDia.get(chaveHoje) ?? 0,
        variacaoPercentual: calcularVariacao(
          receitaPorDia.get(chaveHoje) ?? 0,
          receitaPorDia.get(chaveOntem) ?? 0,
        ),
      } satisfies IndicadorDashboardDto,
      clientesAtivos,
      novosClientesNoMes,
      barbeirosAtivos,
      receitaUltimosSeteDias: [...receitaPorDia].map(([data, valor]) => ({
        data,
        valor,
      })) satisfies PontoSerieDashboardDto[],
      servicosNoMes: [...servicos.values()]
        .sort((a, b) => b.quantidade - a.quantidade)
        .map((item) => ({
          ...item,
          percentual: totalServicos ? Math.round((item.quantidade / totalServicos) * 100) : 0,
        })) satisfies ServicoDashboardDto[],
      desempenhoBarbeiros: [...barbeiros.values()]
        .sort((a, b) => b.receita - a.receita)
        .slice(0, 5),
      agendamentosRecentes: agendamentosRecentes.map((item) => ({
        id: item.id,
        inicio: item.inicioPrevisto.toISOString(),
        cliente: item.cliente.usuario.nome,
        barbeiro: item.barbeiro.nomeProfissional || item.barbeiro.usuario.nome,
        servicos: item.servicos.map((servico) => servico.servico.nome),
        status: item.status,
        total: item.servicos.reduce((total, servico) => total + Number(servico.subtotal), 0),
      })) satisfies AgendamentoResumoDashboardDto[],
    });
  }
}
