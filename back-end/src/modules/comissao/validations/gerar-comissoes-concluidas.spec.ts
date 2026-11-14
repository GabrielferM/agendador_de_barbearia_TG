import { Prisma } from '@prisma/client';
import { calcularComissao, gerarComissoesConcluidas } from './gerar-comissoes-concluidas';
const d = (v: string) => new Prisma.Decimal(v);
describe('comissão na conclusão', () => {
  it.each([
    ['10.01', '50', '5.01'],
    ['100', '0', '0.00'],
    ['80', '100', '80.00'],
  ])('calcula %s a %s%% sem erro de centavos', (base, taxa, valor) => {
    expect(calcularComissao(d(base), d(taxa)).toFixed(2)).toBe(valor);
  });
  it('recusa base negativa e taxa acima de 100', () => {
    expect(() => calcularComissao(d('-1'), d('50'))).toThrow();
    expect(() => calcularComissao(d('10'), d('101'))).toThrow();
  });
  const criar = (taxa: string | null) => ({
    barbeiro: {
      findUniqueOrThrow: jest
        .fn()
        .mockResolvedValue({ percentualComissao: taxa === null ? null : d(taxa) }),
    },
    comissao: {
      findUnique: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
      update: jest.fn(),
    },
  });
  const agendamento = { idBarbeiro: 2, servicos: [{ id: 3, subtotal: d('10.01') }] };
  it('grava uma comissão liberada com snapshot e rejeita taxa ausente', async () => {
    const tx = criar('50');
    await gerarComissoesConcluidas(tx as never, agendamento, new Date());
    expect(tx.comissao.create.mock.calls[0][0].data.valorComissao.toFixed(2)).toBe('5.01');
    expect(tx.comissao.create.mock.calls[0][0].data.status).toBe('LIBERADA');
    const semTaxa = criar(null);
    await expect(
      gerarComissoesConcluidas(semTaxa as never, agendamento, new Date()),
    ).rejects.toThrow('Configure');
    expect(semTaxa.comissao.create).not.toHaveBeenCalled();
  });
  it('preserva valores previstos existentes e recusa estados incompatíveis', async () => {
    const tx = criar('60');
    tx.comissao.findUnique.mockResolvedValue({ id: 1, idBarbeiro: 2, status: 'PREVISTA' });
    await gerarComissoesConcluidas(tx as never, agendamento, new Date());
    expect(tx.comissao.create).not.toHaveBeenCalled();
    expect(tx.comissao.update.mock.calls[0][0].data).toEqual({
      status: 'LIBERADA',
      dataLiberacao: expect.any(Date),
    });
    tx.comissao.findUnique.mockResolvedValue({ id: 1, idBarbeiro: 2, status: 'PAGA' });
    await expect(gerarComissoesConcluidas(tx as never, agendamento, new Date())).rejects.toThrow(
      'incompatível',
    );
  });
});
