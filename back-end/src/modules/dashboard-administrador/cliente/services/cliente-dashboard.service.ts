import { Injectable } from '@nestjs/common';
import { StatusAgendamento, StatusUsuario } from '@prisma/client';
import { adicionarDias, inicioMesBarbearia } from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  STATUS_AGENDAMENTO_SEM_RETORNO,
  STATUS_PROXIMO_AGENDAMENTO,
} from '../constants/cliente-dashboard.constants';
import type { ConsultarClientesDashboardDto } from '../dto/cliente-dashboard.dto';
import type { DatasAtendimentoCliente } from '../types/cliente-dashboard.types';
import { normalizarBuscaCliente } from '../validator/busca-cliente.validator';

@Injectable()
export class ClienteDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(query: ConsultarClientesDashboardDto) {
    const agora = new Date();
    const inicioMes = inicioMesBarbearia(agora);
    const inicioProximoMes = adicionarDias(
      new Date(`${inicioMes.toISOString().slice(0, 7)}-28T00:00:00-03:00`),
      7,
    );
    const fimMes = inicioMesBarbearia(inicioProximoMes);
    const busca = normalizarBuscaCliente(query.busca);
    const where = {
      ...(query.status ? { usuario: { status: query.status } } : {}),
      ...(busca
        ? {
            usuario: {
              ...(query.status ? { status: query.status } : {}),
              OR: [
                { nome: { contains: busca, mode: 'insensitive' as const } },
                { email: { contains: busca, mode: 'insensitive' as const } },
                { telefone: { contains: busca, mode: 'insensitive' as const } },
              ],
            },
          }
        : {}),
    };
    const [clientes, total, ativos, novosNoMes, retornos] = await this.prisma.$transaction([
      this.prisma.cliente.findMany({
        where,
        orderBy: { usuario: { nome: 'asc' } },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        include: { usuario: { select: { nome: true, telefone: true, email: true, status: true } } },
      }),
      this.prisma.cliente.count({ where }),
      this.prisma.cliente.count({ where: { usuario: { status: StatusUsuario.ATIVO } } }),
      this.prisma.cliente.count({
        where: {
          usuario: {
            status: StatusUsuario.ATIVO,
            dataCadastro: { gte: inicioMes, lt: fimMes },
          },
        },
      }),
      this.prisma.agendamento.findMany({
        where: { inicioPrevisto: { gte: agora }, status: STATUS_PROXIMO_AGENDAMENTO },
        distinct: ['idCliente'],
        select: { idCliente: true },
      }),
    ]);
    const ids = clientes.map((item) => item.id);
    const atendimentos = ids.length
      ? await this.prisma.agendamento.findMany({
          where: { idCliente: { in: ids } },
          orderBy: { inicioPrevisto: 'asc' },
          select: { idCliente: true, inicioPrevisto: true, status: true },
        })
      : [];
    const datas = new Map<number, DatasAtendimentoCliente>(
      ids.map((id) => [id, { ultimoAtendimento: null, proximoHorario: null }]),
    );
    for (const item of atendimentos) {
      const atual = datas.get(item.idCliente)!;
      if (item.status === StatusAgendamento.CONCLUIDO && item.inicioPrevisto < agora) {
        atual.ultimoAtendimento = item.inicioPrevisto;
      }
      if (
        !atual.proximoHorario &&
        item.inicioPrevisto >= agora &&
        !STATUS_AGENDAMENTO_SEM_RETORNO.includes(item.status)
      ) {
        atual.proximoHorario = item.inicioPrevisto;
      }
    }

    return serializarResposta({
      geradoEm: agora.toISOString(),
      indicadores: { ativos, novosNoMes, retornoAgendado: retornos.length },
      data: clientes.map((item) => ({
        id: item.id,
        nome: item.usuario.nome,
        telefone: item.usuario.telefone,
        email: item.usuario.email,
        status: item.usuario.status,
        ...datas.get(item.id)!,
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
