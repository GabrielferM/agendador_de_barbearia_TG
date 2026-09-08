import { ForbiddenException, Injectable } from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { serializarResposta } from '../../common/utils/resposta';
import {
  adicionarDias,
  chaveDiaBarbearia,
  inicioDiaBarbearia,
  inicioMesBarbearia,
} from '../../common/utils/periodo-dashboard';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AgendamentoResumoDashboardDto,
  IndicadorDashboardDto,
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../dashboard-administrador/dto/dashboard-administrador-resposta.dto';

const STATUS_VALIDOS = { not: StatusAgendamento.CANCELADO } as const;

function variacao(atual: number, anterior: number) {
  if (anterior === 0) return atual === 0 ? 0 : 100;
  return Math.round(((atual - anterior) / anterior) * 100);
}

@Injectable()
export class DashboardBarbeiroService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(usuario: UsuarioAutenticado) {
    if (!usuario.barbeiroId)
      throw new ForbiddenException('O usuário não possui perfil de barbeiro.');

    const idBarbeiro = usuario.barbeiroId;
    const agora = new Date();
    const hoje = inicioDiaBarbearia(agora);
    const amanha = adicionarDias(hoje, 1);
    const ontem = adicionarDias(hoje, -1);
    const inicioSerie = adicionarDias(hoje, -6);
    const inicioSemanaAnterior = adicionarDias(hoje, -13);
    const inicioMes = inicioMesBarbearia(agora);
    const includeResumo = {
      cliente: { include: { usuario: { select: { nome: true } } } },
      barbeiro: { include: { usuario: { select: { nome: true } } } },
      servicos: { include: { servico: { select: { id: true, nome: true } } } },
    } as const;

    const [
      agendamentosHoje,
      agendamentosOntem,
      itensConcluidos,
      agendaHoje,
      proximos,
      atendimentosDoMes,
      clientesPeriodo,
    ] = await this.prisma.$transaction([
      this.prisma.agendamento.count({
        where: { idBarbeiro, inicioPrevisto: { gte: hoje, lt: amanha }, status: STATUS_VALIDOS },
      }),
      this.prisma.agendamento.count({
        where: { idBarbeiro, inicioPrevisto: { gte: ontem, lt: hoje }, status: STATUS_VALIDOS },
      }),
      this.prisma.agendamentoServico.findMany({
        where: {
          agendamento: {
            idBarbeiro,
            status: StatusAgendamento.CONCLUIDO,
            inicioPrevisto: { gte: inicioSerie, lt: amanha },
          },
        },
        select: { subtotal: true, agendamento: { select: { inicioPrevisto: true } } },
      }),
      this.prisma.agendamento.findMany({
        where: { idBarbeiro, inicioPrevisto: { gte: hoje, lt: amanha }, status: STATUS_VALIDOS },
        orderBy: { inicioPrevisto: 'asc' },
        include: includeResumo,
      }),
      this.prisma.agendamento.findMany({
        where: { idBarbeiro, inicioPrevisto: { gte: agora }, status: STATUS_VALIDOS },
        orderBy: { inicioPrevisto: 'asc' },
        take: 4,
        include: includeResumo,
      }),
      this.prisma.agendamento.findMany({
        where: {
          idBarbeiro,
          status: StatusAgendamento.CONCLUIDO,
          inicioPrevisto: { gte: inicioMes, lt: amanha },
        },
        select: { servicos: { select: { servico: { select: { id: true, nome: true } } } } },
      }),
      this.prisma.agendamento.findMany({
        where: {
          idBarbeiro,
          inicioPrevisto: { gte: inicioSemanaAnterior, lt: amanha },
          status: STATUS_VALIDOS,
        },
        select: { idCliente: true, inicioPrevisto: true },
      }),
    ]);

    const receitaPorDia = new Map<string, number>();
    const atendimentosPorDia = new Map<string, number>();
    for (let indice = 0; indice < 7; indice += 1) {
      const chave = adicionarDias(inicioSerie, indice).toISOString().slice(0, 10);
      receitaPorDia.set(chave, 0);
      atendimentosPorDia.set(chave, 0);
    }
    for (const item of itensConcluidos) {
      const chave = chaveDiaBarbearia(item.agendamento.inicioPrevisto);
      receitaPorDia.set(chave, (receitaPorDia.get(chave) ?? 0) + Number(item.subtotal));
    }
    for (const item of clientesPeriodo) {
      const chave = chaveDiaBarbearia(item.inicioPrevisto);
      if (atendimentosPorDia.has(chave))
        atendimentosPorDia.set(chave, (atendimentosPorDia.get(chave) ?? 0) + 1);
    }

    const clientesAtuais = new Set(
      clientesPeriodo
        .filter((item) => item.inicioPrevisto >= inicioSerie)
        .map((item) => item.idCliente),
    ).size;
    const clientesAnteriores = new Set(
      clientesPeriodo
        .filter((item) => item.inicioPrevisto < inicioSerie)
        .map((item) => item.idCliente),
    ).size;
    const chaveHoje = hoje.toISOString().slice(0, 10);
    const chaveOntem = ontem.toISOString().slice(0, 10);
    const servicos = new Map<number, { nome: string; quantidade: number }>();
    for (const atendimento of atendimentosDoMes) {
      for (const item of atendimento.servicos) {
        const atual = servicos.get(item.servico.id) ?? { nome: item.servico.nome, quantidade: 0 };
        atual.quantidade += 1;
        servicos.set(item.servico.id, atual);
      }
    }
    const totalServicos = [...servicos.values()].reduce(
      (total, item) => total + item.quantidade,
      0,
    );
    const resumir = (item: (typeof agendaHoje)[number]): AgendamentoResumoDashboardDto => ({
      id: item.id,
      inicio: item.inicioPrevisto.toISOString(),
      cliente: item.cliente.usuario.nome,
      barbeiro: item.barbeiro.nomeProfissional || item.barbeiro.usuario.nome,
      servicos: item.servicos.map((servico) => servico.servico.nome),
      status: item.status,
      total: item.servicos.reduce((total, servico) => total + Number(servico.subtotal), 0),
    });

    return serializarResposta({
      geradoEm: agora.toISOString(),
      atendimentosHoje: {
        valor: agendamentosHoje,
        variacaoPercentual: variacao(agendamentosHoje, agendamentosOntem),
      } satisfies IndicadorDashboardDto,
      receitaHoje: {
        valor: receitaPorDia.get(chaveHoje) ?? 0,
        variacaoPercentual: variacao(
          receitaPorDia.get(chaveHoje) ?? 0,
          receitaPorDia.get(chaveOntem) ?? 0,
        ),
      } satisfies IndicadorDashboardDto,
      clientesNaSemana: {
        valor: clientesAtuais,
        variacaoPercentual: variacao(clientesAtuais, clientesAnteriores),
      } satisfies IndicadorDashboardDto,
      atendimentosUltimosSeteDias: [...atendimentosPorDia].map(([data, valor]) => ({
        data,
        valor,
      })) satisfies PontoSerieDashboardDto[],
      servicosNoMes: [...servicos.values()]
        .sort((a, b) => b.quantidade - a.quantidade)
        .map((item) => ({
          ...item,
          percentual: totalServicos ? Math.round((item.quantidade / totalServicos) * 100) : 0,
        })) satisfies ServicoDashboardDto[],
      agendaHoje: agendaHoje.map(resumir),
      proximosAgendamentos: proximos.map(resumir),
    });
  }
}
