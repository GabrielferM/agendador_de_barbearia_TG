import { Injectable } from '@nestjs/common';
import { adicionarDias, inicioMesBarbearia } from '../../../../common/utils/periodo-dashboard';
import { serializarResposta } from '../../../../common/utils/resposta';
import { PrismaService } from '../../../../prisma/prisma.service';
import { STATUS_SERVICO_REALIZADO } from '../constants/servicos-dashboard.constants';
import type { ConsultarServicosDashboardDto } from '../dto/servicos-dashboard.dto';
import type { TotaisServicoDashboard } from '../types/servicos-dashboard.types';
import { converterAtivo, normalizarBuscaServico } from '../validator/filtros-servicos.validator';

@Injectable()
export class ServicosDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async obter(query: ConsultarServicosDashboardDto) {
    const agora = new Date();
    const inicioMes = inicioMesBarbearia(agora);
    const amanha = adicionarDias(agora, 1);
    const busca = normalizarBuscaServico(query.busca);
    const ativo = converterAtivo(query.ativo);
    const where = {
      ...(ativo === undefined ? {} : { ativo }),
      ...(busca ? { nome: { contains: busca, mode: 'insensitive' as const } } : {}),
    };
    const [servicos, total, ativos, atendimentos] = await this.prisma.$transaction([
      this.prisma.servico.findMany({
        where,
        orderBy: { nome: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.servico.count({ where }),
      this.prisma.servico.count({ where: { ativo: true } }),
      this.prisma.agendamento.findMany({
        where: {
          status: STATUS_SERVICO_REALIZADO,
          inicioPrevisto: { gte: inicioMes, lt: amanha },
        },
        select: {
          servicos: {
            select: {
              idServico: true,
              quantidade: true,
              subtotal: true,
              servico: { select: { nome: true } },
            },
          },
        },
      }),
    ]);
    const totais = new Map<number, TotaisServicoDashboard>();
    const nomes = new Map<number, string>();
    let receitaTotal = 0;
    for (const atendimento of atendimentos) {
      for (const item of atendimento.servicos) {
        const atual = totais.get(item.idServico) ?? { realizadosMes: 0, receitaMes: 0 };
        atual.realizadosMes += item.quantidade;
        atual.receitaMes += Number(item.subtotal);
        receitaTotal += Number(item.subtotal);
        totais.set(item.idServico, atual);
        nomes.set(item.idServico, item.servico.nome);
      }
    }
    const maisRealizado = [...totais].sort(([, a], [, b]) => b.realizadosMes - a.realizadosMes)[0];

    return serializarResposta({
      geradoEm: agora.toISOString(),
      indicadores: {
        ativos,
        maisRealizado: maisRealizado ? nomes.get(maisRealizado[0])! : null,
        ticketMedio: atendimentos.length ? receitaTotal / atendimentos.length : 0,
      },
      data: servicos.map((item) => ({
        id: item.id,
        nome: item.nome,
        descricao: item.descricao,
        duracaoMinutos: item.duracaoMinutos,
        preco: Number(item.precoBase),
        ativo: item.ativo,
        ...(totais.get(item.id) ?? { realizadosMes: 0, receitaMes: 0 }),
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
