import { Prisma } from '@prisma/client';
import { ConsultarAreaBarbeiroService, periodoBarbeiro } from './consultar-area-barbeiro.service';
import type { UsuarioAutenticado } from '../../../common/auth/auth.types';

const usuario: UsuarioAutenticado = {
  id: 2,
  barbeiroId: 2,
  papel: 'BARBEIRO',
  nome: 'Teste',
  email: 'teste@local',
  sessaoId: 'local',
  permissoes: ['GERENCIAR_PROPRIA_AGENDA'],
};
describe('consultas próprias do barbeiro', () => {
  const tx = {
    servico: { findMany: jest.fn(), count: jest.fn() },
    cliente: { findMany: jest.fn(), count: jest.fn() },
    agendamento: { findMany: jest.fn(), count: jest.fn() },
    agendamentoServico: { groupBy: jest.fn() },
  };
  const prisma = { ...tx, $transaction: jest.fn() };
  const service = new ConsultarAreaBarbeiroService(prisma as never);
  beforeEach(() => {
    jest.clearAllMocks();
    tx.cliente.findMany.mockResolvedValue([
      { id: 7, usuario: { nome: 'Cliente' }, agendamentos: [], _count: { agendamentos: 3 } },
    ]);
    tx.cliente.count.mockResolvedValue(21);
    tx.agendamento.findMany.mockResolvedValue([]);
    tx.agendamento.count.mockResolvedValue(0);
    tx.servico.findMany.mockResolvedValue([
      {
        id: 1,
        nome: 'Corte',
        descricao: null,
        precoBase: new Prisma.Decimal('60'),
        duracaoMinutos: 30,
        ativo: true,
      },
    ]);
    tx.servico.count.mockResolvedValue(1);
    tx.agendamentoServico.groupBy.mockResolvedValue([
      { idServico: 1, _sum: { quantidade: 4, subtotal: new Prisma.Decimal('119.90') } },
    ]);
    prisma.$transaction.mockImplementation((fn: unknown) =>
      typeof fn === 'function'
        ? (fn as (t: typeof tx) => unknown)(tx)
        : Promise.all(fn as Promise<unknown>[]),
    );
  });
  it.each([2, 9])(
    'agrega serviços somente do profissional %s e usa unidades e valores históricos',
    async (barbeiroId) => {
      const r = await service.servicos({ pagina: 1, limite: 10 }, { ...usuario, barbeiroId });
      expect(r.data[0]).toMatchObject({ quantidade: 4, receita: '119.90', precoBase: '60.00' });
      expect(tx.agendamentoServico.groupBy.mock.calls[0][0].where.agendamento).toMatchObject({
        idBarbeiro: barbeiroId,
        status: 'CONCLUIDO',
      });
      expect(
        tx.servico.findMany.mock.calls[0][0].where.OR[1].itensDeAgendamento.some.agendamento
          .idBarbeiro,
      ).toBe(barbeiroId);
    },
  );
  it('pagina clientes distintos no banco e não expõe cadastro privado', async () => {
    const r = await service.clientes({ pagina: 2, limite: 10, busca: 'Cli' }, usuario);
    expect(tx.cliente.findMany.mock.calls[0][0]).toMatchObject({
      skip: 10,
      take: 10,
      where: { agendamentos: { some: { idBarbeiro: 2 } } },
    });
    expect(r.meta.total).toBe(21);
    expect(r.data).toEqual([
      {
        id: 7,
        nome: 'Cliente',
        ultimoAtendimento: null,
        proximoAgendamento: null,
        atendimentosConcluidos: 3,
      },
    ]);
    expect(tx.agendamento.findMany.mock.calls[0][0].where).toMatchObject({
      idBarbeiro: 2,
      idCliente: { in: [7] },
      status: { in: ['PENDENTE', 'CONFIRMADO'] },
    });
  });
  it('intersecta cliente e estados finais com a identidade e ordena de forma estável', async () => {
    await service.historico({ pagina: 1, limite: 10, idCliente: 99 }, usuario);
    expect(tx.agendamento.findMany.mock.calls[0][0]).toMatchObject({
      where: {
        idBarbeiro: 2,
        idCliente: 99,
        status: { in: ['CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'] },
      },
      orderBy: [{ inicioPrevisto: 'desc' }, { id: 'desc' }],
    });
  });
  it.each(['clientes', 'servicos', 'historico'] as const)(
    'nega papel incorreto e permissão ausente em %s',
    async (metodo) => {
      await expect(
        service[metodo]({ pagina: 1, limite: 10 }, { ...usuario, papel: 'CLIENTE' }),
      ).rejects.toThrow('perfil');
      await expect(
        service[metodo]({ pagina: 1, limite: 10 }, { ...usuario, permissoes: [] }),
      ).rejects.toThrow('perfil');
      expect(prisma.$transaction).not.toHaveBeenCalled();
    },
  );
  it('preserva limites no fuso na virada do ano e rejeita datas impossíveis', () => {
    expect(periodoBarbeiro({ pagina: 1, limite: 10 }, new Date('2027-01-01T02:59:59Z'))).toEqual({
      gte: new Date('2026-12-01T03:00:00Z'),
      lt: new Date('2027-01-01T03:00:00Z'),
    });
    expect(() => periodoBarbeiro({ pagina: 1, limite: 10, inicioDe: '2026-02-30' })).toThrow(
      'Data inválida',
    );
    expect(() =>
      periodoBarbeiro({ pagina: 1, limite: 10, inicioDe: '2026-10-20', inicioAte: '2026-10-01' }),
    ).toThrow('Período');
  });
});
