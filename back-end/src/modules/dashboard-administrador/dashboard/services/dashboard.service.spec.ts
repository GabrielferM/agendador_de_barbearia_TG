import { DashboardService } from './dashboard.service';

describe('DashboardService', () => {
  it('mantém o contrato da visão geral quando o banco está vazio', async () => {
    const prisma = {
      agendamento: { count: jest.fn(), findMany: jest.fn() },
      agendamentoServico: { findMany: jest.fn() },
      cliente: { count: jest.fn() },
      barbeiro: { count: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([0, 0, [], 0, 0, 0, [], []]),
    };
    const service = new DashboardService(prisma as never);

    const resposta = await service.obter();

    expect(resposta).toEqual(
      expect.objectContaining({
        agendamentosHoje: { valor: 0, variacaoPercentual: 0 },
        receitaHoje: { valor: 0, variacaoPercentual: 0 },
        clientesAtivos: 0,
        novosClientesNoMes: 0,
        barbeirosAtivos: 0,
        servicosNoMes: [],
        desempenhoBarbeiros: [],
        agendamentosRecentes: [],
      }),
    );
    expect(resposta.receitaUltimosSeteDias).toHaveLength(7);
  });
});
