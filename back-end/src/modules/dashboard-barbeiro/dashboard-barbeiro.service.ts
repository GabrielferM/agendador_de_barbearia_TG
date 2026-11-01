import type {
  ConsultarBarbeiroDto,
  ConsultarHistoricoBarbeiroDto,
} from './dto/consultas-barbeiro.dto';
import {
  ConsultarAreaBarbeiroService,
  barbeiroDaSessao,
} from './service/consultar-area-barbeiro.service';
import { Injectable } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
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
  PontoSerieDashboardDto,
  ServicoDashboardDto,
} from '../../common/dto/dashboard-resposta.dto';

const STATUS_VALIDOS = { not: StatusAgendamento.CANCELADO } as const;

function variacao(atual: number, anterior: number) {
  if (anterior === 0) return atual === 0 ? 0 : null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

@Injectable()
export class DashboardBarbeiroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly consultas: ConsultarAreaBarbeiroService,
  ) {}
  servicos(query: ConsultarBarbeiroDto, usuario: UsuarioAutenticado) {
    return this.consultas.servicos(query, usuario);
  }
  clientes(query: ConsultarBarbeiroDto, usuario: UsuarioAutenticado) {
    return this.consultas.clientes(query, usuario);
  }
  historico(query: ConsultarHistoricoBarbeiroDto, usuario: UsuarioAutenticado) {
    return this.consultas.historico(query, usuario);
  }

  async obter(usuario: UsuarioAutenticado) {
    const idBarbeiro = barbeiroDaSessao(usuario);
    const agora = new Date();
    const hoje = inicioDiaBarbearia(agora);
    const amanha = adicionarDias(hoje, 1);
    const ontem = adicionarDias(hoje, -1);
    const inicioSerie = adicionarDias(hoje, -6);
    const inicioSemanaAnterior = adicionarDias(hoje, -13);
    const inicioMes = inicioMesBarbearia(agora);
    const selectResumo = {
      id: true,
      inicioPrevisto: true,
      status: true,
      cliente: { select: { usuario: { select: { nome: true } } } },
      barbeiro: { select: { nomeProfissional: true, usuario: { select: { nome: true } } } },
      servicos: { select: { subtotal: true, servico: { select: { id: true, nome: true } } } },
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
        select: selectResumo,
      }),
      this.prisma.agendamento.findMany({
        where: {
          idBarbeiro,
          inicioPrevisto: { gte: agora },
          status: { in: [StatusAgendamento.PENDENTE, StatusAgendamento.CONFIRMADO] },
        },
        orderBy: { inicioPrevisto: 'asc' },
        take: 4,
        select: selectResumo,
      }),
      this.prisma.agendamento.findMany({
        where: {
          idBarbeiro,
          status: StatusAgendamento.CONCLUIDO,
          inicioPrevisto: { gte: inicioMes, lt: amanha },
        },
        select: {
          servicos: { select: { quantidade: true, servico: { select: { id: true, nome: true } } } },
        },
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

    const receitaPorDia = new Map<string, Prisma.Decimal>();
    const atendimentosPorDia = new Map<string, number>();
    for (let indice = 0; indice < 7; indice += 1) {
      const chave = adicionarDias(inicioSerie, indice).toISOString().slice(0, 10);
      receitaPorDia.set(chave, new Prisma.Decimal(0));
      atendimentosPorDia.set(chave, 0);
    }
    for (const item of itensConcluidos) {
      const chave = chaveDiaBarbearia(item.agendamento.inicioPrevisto);
      receitaPorDia.set(
        chave,
        (receitaPorDia.get(chave) ?? new Prisma.Decimal(0)).plus(item.subtotal),
      );
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
        atual.quantidade += item.quantidade;
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
      total: Number(
        item.servicos.reduce(
          (total, servico) => total.plus(servico.subtotal),
          new Prisma.Decimal(0),
        ),
      ),
    });

    return serializarResposta({
      geradoEm: agora.toISOString(),
      atendimentosHoje: {
        valor: agendamentosHoje,
        variacaoPercentual: variacao(agendamentosHoje, agendamentosOntem),
      },
      receitaHoje: {
        valor: Number(receitaPorDia.get(chaveHoje) ?? 0),
        variacaoPercentual: variacao(
          Number(receitaPorDia.get(chaveHoje) ?? 0),
          Number(receitaPorDia.get(chaveOntem) ?? 0),
        ),
      },
      clientesNaSemana: {
        valor: clientesAtuais,
        variacaoPercentual: variacao(clientesAtuais, clientesAnteriores),
      },
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
