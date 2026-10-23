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
  it('conta a quantidade dos itens e soma dinheiro sem erro binário', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2030-01-07T15:00:00Z'));
    try {
      const itens = [
        { quantidade: 2, subtotal: '0.10', servico: { id: 1, nome: 'Corte' } },
        { quantidade: 1, subtotal: '0.20', servico: { id: 2, nome: 'Barba' } },
      ];
      const prisma = {
        agendamento: { count: jest.fn(), findMany: jest.fn() },
        agendamentoServico: { findMany: jest.fn() },
        cliente: { count: jest.fn() },
        barbeiro: { count: jest.fn() },
        $transaction: jest.fn().mockResolvedValue([
          1,
          0,
          itens.map((i) => ({
            ...i,
            agendamento: { inicioPrevisto: new Date('2030-01-07T12:00:00Z') },
          })),
          0,
          0,
          1,
          [],
          [
            {
              idBarbeiro: 2,
              barbeiro: { nomeProfissional: 'João', fotoUrl: null },
              servicos: itens,
            },
          ],
        ]),
      };
      const resposta = await new DashboardService(prisma as never).obter();
      expect(resposta.receitaHoje.valor).toBe(0.3);
      expect(resposta.desempenhoBarbeiros[0].receita).toBe(0.3);
      expect(resposta.servicosNoMes).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ nome: 'Corte', quantidade: 2 }),
          expect.objectContaining({ nome: 'Barba', quantidade: 1 }),
        ]),
      );
    } finally {
      jest.useRealTimers();
    }
  });
});
