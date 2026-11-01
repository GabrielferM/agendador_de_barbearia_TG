import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import type { UsuarioAutenticado } from '../../../common/auth/auth.types';
import { respostaPaginada } from '../../../common/dto/paginacao.dto';
import {
  adicionarDias,
  inicioDiaBarbearia,
  inicioMesBarbearia,
} from '../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConsultarBarbeiroDto, ConsultarHistoricoBarbeiroDto } from '../dto/consultas-barbeiro.dto';

export function barbeiroDaSessao(usuario: UsuarioAutenticado) {
  if (
    usuario.papel !== 'BARBEIRO' ||
    !usuario.barbeiroId ||
    !usuario.permissoes.includes('GERENCIAR_PROPRIA_AGENDA')
  )
    throw new ForbiddenException('O usuário não possui perfil de barbeiro.');
  return usuario.barbeiroId;
}
export function periodoBarbeiro(query: ConsultarBarbeiroDto, agora = new Date()) {
  const dia = (valor: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor))
      throw new BadRequestException('Informe datas no formato AAAA-MM-DD.');
    const data = new Date(`${valor}T00:00:00-03:00`);
    if (!Number.isFinite(data.getTime()) || data.toISOString().slice(0, 10) !== valor)
      throw new BadRequestException('Data inválida.');
    return data;
  };
  const gte = query.inicioDe ? dia(query.inicioDe) : inicioMesBarbearia(agora);
  const fim = query.inicioAte ? dia(query.inicioAte) : inicioDiaBarbearia(agora);
  const lt = adicionarDias(fim, 1);
  if (fim < gte || lt.getTime() - gte.getTime() > 366 * 86400000)
    throw new BadRequestException('Período invertido ou superior a 366 dias.');
  return { gte, lt };
}
const selectAtendimento = {
  id: true,
  inicioPrevisto: true,
  fimPrevisto: true,
  status: true,
  motivoCancelamento: true,
  filial: {
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
  },
  cliente: { select: { id: true, usuario: { select: { nome: true } } } },
  barbeiro: { select: { id: true, nomeProfissional: true } },
  servicos: {
    select: {
      idServico: true,
      quantidade: true,
      precoAplicado: true,
      subtotal: true,
      duracaoAplicadaMinutos: true,
      servico: { select: { id: true, nome: true } },
    },
  },
} satisfies Prisma.AgendamentoSelect;

@Injectable()
export class ConsultarAreaBarbeiroService {
  constructor(private readonly prisma: PrismaService) {}
  async servicos(query: ConsultarBarbeiroDto, usuario: UsuarioAutenticado) {
    const idBarbeiro = barbeiroDaSessao(usuario);
    const inicioPrevisto = periodoBarbeiro(query);
    const where: Prisma.ServicoWhereInput = {
      nome: query.busca ? { contains: query.busca.trim(), mode: 'insensitive' } : undefined,
      OR: [{ ativo: true }, { itensDeAgendamento: { some: { agendamento: { idBarbeiro } } } }],
    };
    return this.prisma.$transaction(async (tx) => {
      const data = await tx.servico.findMany({
        where,
        select: {
          id: true,
          nome: true,
          descricao: true,
          precoBase: true,
          duracaoMinutos: true,
          ativo: true,
        },
        orderBy: [{ nome: 'asc' }, { id: 'asc' }],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      });
      const total = await tx.servico.count({ where });
      const metricas = await tx.agendamentoServico.groupBy({
        by: ['idServico'],
        where: {
          idServico: { in: data.map((item) => item.id) },
          agendamento: { idBarbeiro, status: 'CONCLUIDO', inicioPrevisto },
        },
        _sum: { quantidade: true, subtotal: true },
      });
      return respostaPaginada(
        serializarResposta(
          data.map((item) => {
            const metrica = metricas.find((m) => m.idServico === item.id);
            return {
              ...item,
              quantidade: metrica?._sum.quantidade ?? 0,
              receita: metrica?._sum.subtotal ?? new Prisma.Decimal(0),
            };
          }),
        ),
        total,
        query.pagina,
        query.limite,
      );
    });
  }
  async clientes(query: ConsultarBarbeiroDto, usuario: UsuarioAutenticado) {
    const idBarbeiro = barbeiroDaSessao(usuario);
    const agora = new Date();
    const where: Prisma.ClienteWhereInput = {
      agendamentos: { some: { idBarbeiro } },
      usuario: { nome: { contains: query.busca?.trim() ?? '', mode: 'insensitive' } },
    };
    return this.prisma.$transaction(async (tx) => {
      const data = await tx.cliente.findMany({
        where,
        select: {
          id: true,
          usuario: { select: { nome: true } },
          agendamentos: {
            where: { idBarbeiro, status: 'CONCLUIDO' },
            orderBy: [{ inicioPrevisto: 'desc' }, { id: 'desc' }],
            take: 1,
            select: { inicioPrevisto: true },
          },
          _count: { select: { agendamentos: { where: { idBarbeiro, status: 'CONCLUIDO' } } } },
        },
        orderBy: [{ usuario: { nome: 'asc' } }, { id: 'asc' }],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      });
      const total = await tx.cliente.count({ where });
      const proximos = await tx.agendamento.findMany({
        where: {
          idBarbeiro,
          idCliente: { in: data.map((c) => c.id) },
          status: { in: ['PENDENTE', 'CONFIRMADO'] },
          inicioPrevisto: { gte: agora },
        },
        distinct: ['idCliente'],
        orderBy: [{ inicioPrevisto: 'asc' }, { id: 'asc' }],
        select: { idCliente: true, inicioPrevisto: true },
      });
      return respostaPaginada(
        data.map((c) => ({
          id: c.id,
          nome: c.usuario.nome,
          ultimoAtendimento: c.agendamentos[0]?.inicioPrevisto.toISOString() ?? null,
          proximoAgendamento:
            proximos.find((p) => p.idCliente === c.id)?.inicioPrevisto.toISOString() ?? null,
          atendimentosConcluidos: c._count.agendamentos,
        })),
        total,
        query.pagina,
        query.limite,
      );
    });
  }
  async historico(query: ConsultarHistoricoBarbeiroDto, usuario: UsuarioAutenticado) {
    const idBarbeiro = barbeiroDaSessao(usuario);
    const inicioPrevisto = periodoBarbeiro(query);
    const where: Prisma.AgendamentoWhereInput = {
      idBarbeiro,
      inicioPrevisto,
      idCliente: query.idCliente,
      status: query.status ?? {
        in: [
          StatusAgendamento.CONCLUIDO,
          StatusAgendamento.CANCELADO,
          StatusAgendamento.NAO_COMPARECEU,
        ],
      },
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.agendamento.findMany({
        where,
        select: selectAtendimento,
        orderBy: [{ inicioPrevisto: 'desc' }, { id: 'desc' }],
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.agendamento.count({ where }),
    ]);
    return respostaPaginada(
      serializarResposta(
        data.map((item) => ({
          ...item,
          cliente: { id: item.cliente.id, nome: item.cliente.usuario.nome },
        })),
      ),
      total,
      query.pagina,
      query.limite,
    );
  }
}
