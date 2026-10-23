import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { EditarAgendamentoService } from './editar-agendamento.service';

function preparar() {
  const atual = {
    id: 1,
    idCliente: 2,
    idBarbeiro: 3,
    idFilial: 4,
    status: 'PENDENTE',
    inicioPrevisto: new Date('2030-01-07T12:00:00Z'),
    servicos: [
      {
        idServico: 5,
        quantidade: 1,
        duracaoAplicadaMinutos: 30,
        precoAplicado: new Prisma.Decimal(30),
        desconto: new Prisma.Decimal(0),
        subtotal: new Prisma.Decimal(30),
        ordemExecucao: 1,
      },
    ],
  };
  const tx = {
    agendamento: {
      findUnique: jest.fn().mockResolvedValue(atual),
      update: jest.fn().mockResolvedValue(atual),
    },
    agendamentoServico: { count: jest.fn().mockResolvedValue(0) },
    historicoStatusAgendamento: { create: jest.fn().mockResolvedValue({ id: 10 }) },
  };
  const prisma = { $transaction: jest.fn((fn: (tx: unknown) => unknown) => fn(tx)) };
  const validar = { execute: jest.fn() },
    conflito = { execute: jest.fn() };
  const service = new EditarAgendamentoService(
    prisma as never,
    { execute: jest.fn((data: string) => new Date(data)) },
    { execute: jest.fn() } as never,
    conflito as never,
    validar as never,
  );
  return { tx, service, validar, conflito };
}
describe('Agenda administrativa', () => {
  it('altera status e registra o responsável na mesma transação', async () => {
    const { tx, service } = preparar();
    await service.execute(1, { status: 'CONFIRMADO' }, 9);
    expect(tx.agendamento.update).toHaveBeenCalled();
    expect(tx.historicoStatusAgendamento.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          statusAnterior: 'PENDENTE',
          statusNovo: 'CONFIRMADO',
          idUsuarioResponsavel: 9,
        }),
      }),
    );
  });
  it('propaga falha do histórico para reverter a transação', async () => {
    const { tx, service } = preparar();
    tx.historicoStatusAgendamento.create.mockRejectedValue(new Error('falha simulada'));
    await expect(service.execute(1, { status: 'CONFIRMADO' }, 9)).rejects.toThrow('falha simulada');
  });
  it('bloqueia troca de profissional com comissão vinculada', async () => {
    const { tx, service } = preparar();
    tx.agendamentoServico.count.mockResolvedValue(1);
    await expect(service.execute(1, { idBarbeiro: 6 }, 9)).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(tx.agendamento.update).not.toHaveBeenCalled();
  });
  it('valida novos vínculos e conflitos com o novo profissional', async () => {
    const { service, validar, conflito, tx } = preparar();
    await service.execute(1, { idBarbeiro: 6 }, 9);
    expect(validar.execute).toHaveBeenCalledWith(2, 6, 4, tx);
    expect(conflito.execute).toHaveBeenCalledWith(6, expect.any(Date), expect.any(Date), 1, tx);
  });
  it('rejeita histórico com estado anterior desatualizado', async () => {
    const { service } = preparar();
    await expect(
      service.execute(1, { status: 'CONFIRMADO' }, 9, {
        idUsuarioResponsavel: 9,
        statusNovo: 'CONFIRMADO',
        statusAnterior: 'CONCLUIDO',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
