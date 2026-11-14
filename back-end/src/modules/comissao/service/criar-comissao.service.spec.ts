import { Prisma } from '@prisma/client';
import { CriarComissaoService } from './criar-comissao.service';

describe('previsão manual de comissão', () => {
  const criar = jest.fn();
  const buscarBarbeiro = jest.fn();
  const tx = {
    agendamentoServico: {
      findUnique: jest.fn().mockResolvedValue({
        id: 4,
        subtotal: new Prisma.Decimal('50.00'),
        agendamento: { idBarbeiro: 2, status: 'CONFIRMADO' },
      }),
    },
    barbeiro: { findUnique: buscarBarbeiro },
    comissao: { create: criar },
  };
  const service = new CriarComissaoService({
    $transaction: (fn: (cliente: typeof tx) => unknown) => fn(tx),
  } as never);
  const item = { idAgendamentoServico: 4, idBarbeiro: 2 };

  beforeEach(() => {
    jest.clearAllMocks();
    buscarBarbeiro.mockResolvedValue({ percentualComissao: new Prisma.Decimal('25.00') });
  });

  it('usa a taxa cadastrada quando a previsão é criada sem percentual', async () => {
    await service.execute(item);
    expect(criar).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          percentualAplicado: new Prisma.Decimal('25.00'),
          valorComissao: new Prisma.Decimal('12.50'),
        }),
      }),
    );
  });

  it('recusa sobrescrever a taxa e não inventa percentual ausente', async () => {
    await expect(service.execute({ ...item, percentualAplicado: 50 })).rejects.toThrow(
      'difere da taxa cadastrada',
    );
    buscarBarbeiro.mockResolvedValue({ percentualComissao: null });
    await expect(service.execute(item)).rejects.toThrow('Configure o percentual');
    expect(criar).not.toHaveBeenCalled();
  });
});
