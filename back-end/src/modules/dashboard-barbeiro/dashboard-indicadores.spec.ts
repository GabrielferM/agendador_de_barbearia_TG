import { Prisma } from '@prisma/client';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
describe('indicadores reais', () => {
  it('conta quantidades, exclui estados finais dos próximos e não inventa variação sem base', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2026-11-01T02:50:00Z'));
    const prisma = {
      agendamento: {
        count: jest.fn().mockResolvedValueOnce(2).mockResolvedValueOnce(0),
        findMany: jest
          .fn()
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([])
          .mockResolvedValueOnce([
            {
              servicos: [
                { quantidade: 3, servico: { id: 1, nome: 'Corte' } },
                { quantidade: 2, servico: { id: 2, nome: 'Barba' } },
              ],
            },
          ])
          .mockResolvedValueOnce([
            { idCliente: 1, inicioPrevisto: new Date('2026-10-31T15:00:00Z') },
            { idCliente: 1, inicioPrevisto: new Date('2026-10-31T16:00:00Z') },
          ]),
      },
      agendamentoServico: {
        findMany: jest.fn().mockResolvedValue([
          {
            subtotal: new Prisma.Decimal('0.10'),
            agendamento: { inicioPrevisto: new Date('2026-10-31T15:00:00Z') },
          },
          {
            subtotal: new Prisma.Decimal('0.20'),
            agendamento: { inicioPrevisto: new Date('2026-10-31T16:00:00Z') },
          },
        ]),
      },
      $transaction: (ops: Promise<unknown>[]) => Promise.all(ops),
    };
    try {
      const r = await new DashboardBarbeiroService(prisma as never, {} as never).obter({
        id: 2,
        barbeiroId: 2,
        papel: 'BARBEIRO',
        permissoes: ['GERENCIAR_PROPRIA_AGENDA'],
      } as UsuarioAutenticado);
      expect(r.atendimentosHoje).toEqual({ valor: 2, variacaoPercentual: null });
      expect(r.receitaHoje.valor).toBe(0.3);
      expect(r.clientesNaSemana.valor).toBe(1);
      expect(r.servicosNoMes.reduce((t, s) => t + s.quantidade, 0)).toBe(5);
      expect(prisma.agendamento.findMany.mock.calls[1][0].where).toMatchObject({
        idBarbeiro: 2,
        status: { in: ['PENDENTE', 'CONFIRMADO'] },
      });
    } finally {
      jest.useRealTimers();
    }
  });
});
