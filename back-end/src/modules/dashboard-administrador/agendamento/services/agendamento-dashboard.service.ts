import { Injectable } from '@nestjs/common';
import { StatusAgendamento } from '@prisma/client';
import { adicionarDias, chaveDiaBarbearia } from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import { STATUS_AGENDAMENTO } from '../constants/agendamento-dashboard.constants';
import type { ConsultarAgendaDashboardDto } from '../dto/agendamento-dashboard.dto';
import { validarPeriodoAgenda } from '../validator/periodo-agenda.validator';

const nomeDia = new Intl.DateTimeFormat('pt-BR', {
  timeZone: 'America/Sao_Paulo',
  weekday: 'long',
});

@Injectable()
export class AgendamentoDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(query: ConsultarAgendaDashboardDto) {
    const agora = new Date();
    const { inicio, fimExclusivo } = validarPeriodoAgenda(query, agora);
    const agendamentos = await this.prisma.agendamento.findMany({
      where: { inicioPrevisto: { gte: inicio, lt: fimExclusivo } },
      orderBy: { inicioPrevisto: 'asc' },
      include: {
        cliente: { include: { usuario: { select: { nome: true } } } },
        barbeiro: { include: { usuario: { select: { nome: true } } } },
        servicos: { include: { servico: { select: { nome: true } } } },
      },
    });
    const totaisPorStatus = Object.fromEntries(
      STATUS_AGENDAMENTO.map((status) => [status, 0]),
    ) as Record<StatusAgendamento, number>;
    const porDia = new Map<string, typeof agendamentos>();
    for (let data = inicio; data < fimExclusivo; data = adicionarDias(data, 1)) {
      porDia.set(data.toISOString().slice(0, 10), []);
    }
    for (const item of agendamentos) {
      totaisPorStatus[item.status] += 1;
      porDia.get(chaveDiaBarbearia(item.inicioPrevisto))?.push(item);
    }

    return serializarResposta({
      geradoEm: agora.toISOString(),
      periodo: {
        inicioDe: inicio.toISOString().slice(0, 10),
        inicioAte: adicionarDias(fimExclusivo, -1).toISOString().slice(0, 10),
      },
      totaisPorStatus,
      dias: [...porDia].map(([data, itens]) => ({
        data,
        rotulo: nomeDia.format(new Date(`${data}T12:00:00-03:00`)),
        agendamentos: itens.map((item) => ({
          id: item.id,
          inicio: item.inicioPrevisto,
          fim: item.fimPrevisto,
          cliente: item.cliente.usuario.nome,
          barbeiro: item.barbeiro.nomeProfissional || item.barbeiro.usuario.nome,
          servicos: item.servicos.map((servico) => servico.servico.nome),
          status: item.status,
          total: item.servicos.reduce((total, servico) => total + Number(servico.subtotal), 0),
        })),
      })),
    });
  }
}
