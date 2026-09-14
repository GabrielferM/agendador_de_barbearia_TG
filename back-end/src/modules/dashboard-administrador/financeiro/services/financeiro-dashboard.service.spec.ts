import { StatusAgendamento, StatusComissao } from '@prisma/client';
import { FinanceiroDashboardService } from './financeiro-dashboard.service';

describe('FinanceiroDashboardService', () => {
  it('agrega receitas decimais e comissões por barbeiro', async () => {
    const prisma = {
      agendamento: { findMany: jest.fn() },
      agendamentoServico: { findMany: jest.fn() },
      comissao: { findMany: jest.fn() },
      $transaction: jest.fn().mockResolvedValue([
        [
          {
            id: 10,
            inicioPrevisto: new Date('2026-09-08T12:00:00-03:00'),
            status: StatusAgendamento.CONCLUIDO,
            cliente: { usuario: { nome: 'Cliente Teste' } },
            servicos: [
              { subtotal: '35.50', servico: { nome: 'Corte' } },
              { subtotal: '20.00', servico: { nome: 'Barba' } },
            ],
          },
        ],
        [{ subtotal: '50.00' }],
        [
          {
            idBarbeiro: 2,
            valorComissao: '22.20',
            status: StatusComissao.LIBERADA,
            barbeiro: { nomeProfissional: 'Profissional', usuario: { nome: 'Usuário' } },
          },
        ],
      ]),
    };
    const service = new FinanceiroDashboardService(prisma as never);

    const resposta = await service.obter({
      inicioDe: '2026-09-01',
      inicioAte: '2026-09-30',
    });

    expect(resposta.indicadores).toEqual({
      receita: 55.5,
      variacaoReceitaPercentual: 11,
      comissoes: 22.2,
    });
    expect(resposta.movimentacoesRecentes[0]).toMatchObject({
      descricao: 'Corte + Barba - Cliente Teste',
      valor: 55.5,
    });
    expect(resposta.comissoesPorBarbeiro[0]).toMatchObject({
      barbeiro: 'Profissional',
      total: 22.2,
      porStatus: { LIBERADA: 22.2 },
    });
  });
});
