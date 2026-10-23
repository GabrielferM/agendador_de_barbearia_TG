import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CriarComissaoService } from './criar-comissao.service';
import { EditarComissaoService } from './editar-comissao.service';

function preparar() {
  const item = {
    id: 1,
    subtotal: new Prisma.Decimal('29.99'),
    agendamento: { idBarbeiro: 2, status: 'CONCLUIDO' },
    comissao: null,
  };
  const atual = {
    id: 3,
    status: 'PREVISTA',
    dataGeracao: new Date('2020-01-01'),
    dataLiberacao: null,
    dataPagamento: null,
    agendamentoServico: { agendamento: { status: 'CONCLUIDO' } },
  };
  const tx = {
    agendamentoServico: { findUnique: jest.fn().mockResolvedValue(item) },
    comissao: {
      findUnique: jest.fn().mockResolvedValue(atual),
      create: jest.fn().mockImplementation(({ data }: { data: object }) => Promise.resolve(data)),
      update: jest.fn().mockImplementation(({ data }: { data: object }) => Promise.resolve(data)),
    },
  };
  const prisma = { $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(tx)) };
  return { tx, prisma, atual, item };
}
describe('Comissões administrativas', () => {
  it('calcula com decimal e arredonda o valor para duas casas na transação', async () => {
    const { tx, prisma } = preparar();
    const resultado = await new CriarComissaoService(prisma as never).execute({
      idAgendamentoServico: 1,
      idBarbeiro: 2,
      percentualAplicado: 10,
    });
    expect(resultado).toMatchObject({ baseCalculo: '29.99', valorComissao: '3.00' });
    expect(tx.comissao.create).toHaveBeenCalled();
  });
  it('rejeita percentual acima de 100 antes de gravar', async () => {
    const { prisma } = preparar();
    await expect(
      new CriarComissaoService(prisma as never).execute({
        idAgendamentoServico: 1,
        idBarbeiro: 2,
        percentualAplicado: 101,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
  it('não gera uma segunda comissão para o mesmo item', async () => {
    const { tx, prisma, item } = preparar();
    tx.agendamentoServico.findUnique.mockResolvedValue({ ...item, comissao: { id: 8 } });
    await expect(
      new CriarComissaoService(prisma as never).execute({
        idAgendamentoServico: 1,
        idBarbeiro: 2,
        percentualAplicado: 20,
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
  it('exige atendimento concluído para liberar', async () => {
    const { tx, prisma, atual } = preparar();
    tx.comissao.findUnique.mockResolvedValue({
      ...atual,
      agendamentoServico: { agendamento: { status: 'CONFIRMADO' } },
    });
    await expect(
      new EditarComissaoService(prisma as never).execute(3, { status: 'LIBERADA' }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(tx.comissao.update).not.toHaveBeenCalled();
  });
  it('registra data de liberação e rejeita salto direto para paga', async () => {
    const { tx, prisma } = preparar();
    const service = new EditarComissaoService(prisma as never);
    await expect(service.execute(3, { status: 'PAGA' })).rejects.toBeInstanceOf(ConflictException);
    await service.execute(3, { status: 'LIBERADA' });
    expect(tx.comissao.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'LIBERADA', dataLiberacao: expect.any(Date) } }),
    );
  });
  it('exige motivo de estorno e data posterior ao pagamento', async () => {
    const { tx, prisma, atual } = preparar();
    tx.comissao.findUnique.mockResolvedValue({
      ...atual,
      status: 'PAGA',
      dataPagamento: new Date('2025-01-01'),
    });
    const service = new EditarComissaoService(prisma as never);
    await expect(service.execute(3, { status: 'ESTORNADA' })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    await expect(
      service.execute(3, {
        status: 'ESTORNADA',
        motivoEstorno: 'Correção',
        dataEstorno: '2024-01-01T00:00:00Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await service.execute(3, { status: 'ESTORNADA', motivoEstorno: 'Correção' });
    expect(tx.comissao.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: 'ESTORNADA', motivoEstorno: 'Correção' }),
      }),
    );
  });
});
