import { AgendamentoDashboardService } from './agendamento-dashboard.service';

describe('AgendamentoDashboardService', () => {
  it('preenche todos os dias e status quando não há agendamentos', async () => {
    const prisma = { agendamento: { findMany: jest.fn().mockResolvedValue([]) } };
    const service = new AgendamentoDashboardService(prisma as never);

    const resposta = await service.obter({
      inicioDe: '2026-09-07',
      inicioAte: '2026-09-13',
    });

    expect(resposta.dias).toHaveLength(7);
    expect(resposta.dias.every((dia) => dia.agendamentos.length === 0)).toBe(true);
    expect(Object.values(resposta.totaisPorStatus).every((total) => total === 0)).toBe(true);
  });
});
