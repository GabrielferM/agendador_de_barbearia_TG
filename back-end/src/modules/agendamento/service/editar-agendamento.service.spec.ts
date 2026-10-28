import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { EditarAgendamentoService } from './editar-agendamento.service';
import { PrepararItensAgendamentoService } from '../validations/preparar-itens-agendamento.service';
import { VerificarConflitoAgendamentoService } from '../validations/verificar-conflito-agendamento.service';
import { ValidarVinculosAgendamentoService } from '../validations/validar-vinculos-agendamento.service';

describe('transições administrativas de agenda', () => {
  function contexto(status = 'PENDENTE') {
    const tx = {
      comissao: {
        count: jest.fn().mockResolvedValue(0),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
      agendamento: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          idCliente: 3,
          idBarbeiro: 2,
          idFilial: 4,
          status,
          inicioPrevisto: new Date('2030-01-07T12:00:00Z'),
          servicos: [
            {
              idServico: 1,
              precoAplicado: new Prisma.Decimal(50),
              duracaoAplicadaMinutos: 30,
              quantidade: 1,
              desconto: new Prisma.Decimal(0),
              subtotal: new Prisma.Decimal(50),
              ordemExecucao: 1,
            },
          ],
        }),
        update: jest.fn().mockResolvedValue({ id: 1 }),
      },
      agendamentoServico: { count: jest.fn().mockResolvedValue(0) },
    };
    const prisma = {
      $transaction: jest.fn((f: (t: typeof tx) => unknown) => Promise.resolve(f(tx))),
    };
    const service = new EditarAgendamentoService(
      prisma as unknown as PrismaService,
      { execute: (v: string) => new Date(v) },
      {} as PrepararItensAgendamentoService,
      {} as VerificarConflitoAgendamentoService,
      {} as ValidarVinculosAgendamentoService,
    );
    return { tx, prisma, service };
  }
  it('grava estado e responsável no mesmo nested write serializável', async () => {
    const { tx, prisma, service } = contexto();
    await service.execute(1, { status: 'CONFIRMADO' }, 77);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'Serializable',
    });
    expect(tx.agendamento.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'CONFIRMADO',
          historicoDeStatus: {
            create: {
              idUsuarioResponsavel: 77,
              statusAnterior: 'PENDENTE',
              statusNovo: 'CONFIRMADO',
              motivo: undefined,
            },
          },
        }),
      }),
    );
  });
  it('rejeita estado final e transição inválida sem gravação', async () => {
    for (const status of ['CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU']) {
      const { tx, service } = contexto(status);
      await expect(service.execute(1, { status: 'CONFIRMADO' }, 77)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(tx.agendamento.update).not.toHaveBeenCalled();
    }
    await expect(contexto().service.execute(1, { status: 'CONCLUIDO' }, 77)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
  it('cancela comissões não pagas junto do atendimento e bloqueia comissão paga', async () => {
    const c = contexto();
    await c.service.execute(
      1,
      { status: 'CANCELADO', motivoCancelamento: 'Solicitado pelo cliente' },
      77,
    );
    expect(c.tx.comissao.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({ data: { status: 'CANCELADA' } }),
    );
    const outro = contexto();
    outro.tx.comissao.count.mockResolvedValue(1);
    await expect(
      outro.service.execute(1, { status: 'CANCELADO', motivoCancelamento: 'Solicitado' }, 77),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(outro.tx.agendamento.update).not.toHaveBeenCalled();
  });
  it('exige motivo no cancelamento e preserva comissões ao trocar vínculos', async () => {
    await expect(contexto().service.execute(1, { status: 'CANCELADO' }, 77)).rejects.toThrow(
      'Motivo',
    );
    const { tx, service } = contexto();
    tx.agendamentoServico.count.mockResolvedValue(1);
    await expect(service.execute(1, { idBarbeiro: 8 }, 77)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
