import { Prisma } from '@prisma/client';
import { RegistrarRepasseService } from './registrar-repasse.service';
import { ConsultarFinanceiroService } from './consultar-financeiro.service';
import { ConfigurarPercentualDto } from '../dto/financeiro.dto';
import { validate } from 'class-validator';

describe('repasses e isolamento financeiro', () => {
  const tx = {
    comissao: { findUnique: jest.fn(), updateMany: jest.fn() },
    repasseComissao: { create: jest.fn() },
  };
  const prisma = { $transaction: jest.fn() };
  const service = new RegistrarRepasseService(prisma as never);
  beforeEach(() => {
    jest.resetAllMocks();
    prisma.$transaction.mockImplementation((fn: (t: typeof tx) => unknown) => fn(tx));
    tx.comissao.findUnique.mockResolvedValue({
      id: 3,
      status: 'LIBERADA',
      valorComissao: new Prisma.Decimal('5.01'),
      repasse: null,
    });
    tx.comissao.updateMany.mockResolvedValue({ count: 1 });
  });
  it('baixa com valor histórico e responsável; repetição devolve o registro sem nova baixa', async () => {
    const pago = await service.execute(3, 8);
    expect(pago.valor).toBe('5.01');
    expect(tx.repasseComissao.create).toHaveBeenCalledWith({
      data: expect.objectContaining({ idComissao: 3, idUsuarioResponsavel: 8 }),
    });
    tx.comissao.findUnique.mockResolvedValue({
      status: 'PAGA',
      repasse: { valor: new Prisma.Decimal('5.01'), dataRegistro: new Date(pago.dataRegistro) },
    });
    expect(await service.execute(3, 8)).toEqual(pago);
    expect(tx.repasseComissao.create).toHaveBeenCalledTimes(1);
  });
  it.each(['PREVISTA', 'CANCELADA', 'ESTORNADA', 'PAGA'])('não paga estado %s', async (status) => {
    tx.comissao.findUnique.mockResolvedValue({ status, repasse: null });
    await expect(service.execute(3, 8)).rejects.toThrow('liberada');
    expect(tx.comissao.updateMany).not.toHaveBeenCalled();
  });
  it('propaga falha de auditoria e recusa baixa concorrente', async () => {
    tx.repasseComissao.create.mockRejectedValueOnce(new Error('falha de auditoria'));
    await expect(service.execute(3, 8)).rejects.toThrow('falha de auditoria');
    tx.comissao.updateMany.mockResolvedValueOnce({ count: 0 });
    await expect(service.execute(3, 8)).rejects.toThrow('simultaneamente');
  });
  it('limita todas as consultas ao barbeiro da sessão e soma fora da paginação', async () => {
    const comissao = {
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(25),
      aggregate: jest
        .fn()
        .mockResolvedValue({ _sum: { valorComissao: new Prisma.Decimal('50.50') } }),
    };
    const consulta = new ConsultarFinanceiroService({
      $transaction: (fn: (t: unknown) => unknown) => fn({ comissao }),
    } as never);
    const usuario = {
      id: 2,
      barbeiroId: 2,
      papel: 'BARBEIRO',
      permissoes: ['GERENCIAR_PROPRIA_AGENDA'],
    };
    const resultado = await consulta.execute({ pagina: 2, limite: 20 }, usuario as never);
    expect(resultado.aReceber).toBe('50.50');
    expect(resultado.totalPaginas).toBe(2);
    for (const metodo of [comissao.findMany, comissao.count, comissao.aggregate]) {
      for (const [args] of metodo.mock.calls) expect(args.where.idBarbeiro).toBe(2);
    }
    await expect(
      consulta.execute({ pagina: 1, limite: 20 }, { ...usuario, papel: 'CLIENTE' } as never),
    ).rejects.toThrow('restrito');
  });
  it('valida zero e limites do percentual sem coerção de vazio/null', async () => {
    for (const percentual of [0, 100, 33.33])
      expect(
        await validate(Object.assign(new ConfigurarPercentualDto(), { percentual })),
      ).toHaveLength(0);
    for (const percentual of [null, '', '50', -1, 101, 33.333])
      expect(
        (await validate(Object.assign(new ConfigurarPercentualDto(), { percentual }))).length,
      ).toBeGreaterThan(0);
  });
});
