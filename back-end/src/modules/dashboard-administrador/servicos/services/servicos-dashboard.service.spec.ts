import { ServicosDashboardService } from './servicos-dashboard.service';

describe('ServicosDashboardService', () => {
  afterEach(() => jest.useRealTimers());
  it('aplica busca, status e paginação e converte valores decimais', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-10-26T23:30:00-03:00'));
    const findMany = jest.fn();
    const prisma = {
      servico: { findMany, count: jest.fn() },
      agendamento: { findMany: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([
        [
          {
            id: 1,
            nome: 'Corte',
            descricao: null,
            duracaoMinutos: 30,
            precoBase: '45.50',
            ativo: true,
          },
        ],
        1,
        3,
        [],
      ]),
    };
    const service = new ServicosDashboardService(prisma as never);

    const resposta = await service.obter({
      pagina: 2,
      limite: 5,
      busca: ' corte ',
      ativo: 'true',
    });

    expect(prisma.agendamento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          inicioPrevisto: {
            gte: new Date('2026-10-01T00:00:00-03:00'),
            lt: new Date('2026-10-27T00:00:00-03:00'),
          },
        }),
      }),
    );
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { ativo: true, nome: { contains: 'corte', mode: 'insensitive' } },
        skip: 5,
        take: 5,
      }),
    );
    expect(resposta.data[0]).toMatchObject({ preco: 45.5, realizadosMes: 0, receitaMes: 0 });
    expect(resposta.meta).toEqual({ pagina: 2, limite: 5, total: 1, totalPaginas: 1 });
  });
});
