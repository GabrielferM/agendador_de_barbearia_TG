import { BadRequestException, ConflictException } from '@nestjs/common';
import { Prisma, StatusComissao } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarComissaoService } from './criar-comissao.service';
import { EditarComissaoService } from './editar-comissao.service';

describe('comissões: valores e estados', () => {
  function contexto(status: StatusComissao = 'PREVISTA') {
    const atual = {
      id: 1,
      status,
      dataGeracao: new Date('2026-01-01T10:00:00Z'),
      dataLiberacao: new Date('2026-01-02T10:00:00Z'),
      dataPagamento: new Date('2026-01-03T10:00:00Z'),
      agendamentoServico: { agendamento: { status: 'CONCLUIDO' } },
    };
    const tx = {
      agendamentoServico: {
        findUnique: jest.fn().mockResolvedValue({
          id: 5,
          subtotal: new Prisma.Decimal('10.01'),
          agendamento: { idBarbeiro: 9, status: 'CONCLUIDO' },
        }),
      },
      comissao: {
        findUnique: jest.fn().mockResolvedValue(atual),
        update: jest.fn().mockResolvedValue({ id: 1 }),
        create: jest.fn().mockResolvedValue({ id: 1 }),
      },
    };
    const prisma = {
      $transaction: jest.fn((f: (t: typeof tx) => unknown) => Promise.resolve(f(tx))),
    };
    return {
      atual,
      tx,
      prisma,
      criar: new CriarComissaoService(prisma as unknown as PrismaService),
      editar: new EditarComissaoService(prisma as unknown as PrismaService),
    };
  }
  it('calcula no servidor com decimal e arredondamento explícito', async () => {
    const { criar, tx } = contexto();
    await criar.execute({ idAgendamentoServico: 5, idBarbeiro: 9, percentualAplicado: 33.33 });
    const args = tx.comissao.create.mock.calls[0][0] as {
      data: { valorComissao: Prisma.Decimal; baseCalculo: Prisma.Decimal };
    };
    expect(args.data.valorComissao.toFixed(2)).toBe('3.34');
    expect(args.data.baseCalculo.toFixed(2)).toBe('10.01');
  });
  it('rejeita percentual acima de 100 e vínculo incorreto', async () => {
    await expect(
      contexto().criar.execute({ idAgendamentoServico: 5, idBarbeiro: 9, percentualAplicado: 101 }),
    ).rejects.toBeInstanceOf(ConflictException);
    await expect(
      contexto().criar.execute({ idAgendamentoServico: 5, idBarbeiro: 8, percentualAplicado: 10 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
  it('exige conclusão para liberar e rejeita pagamento direto de prevista', async () => {
    const c = contexto();
    c.atual.agendamentoServico.agendamento.status = 'CONFIRMADO';
    await expect(c.editar.execute(1, { status: 'LIBERADA' })).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(contexto().editar.execute(1, { status: 'PAGA' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
  it('exige motivo para estorno, respeita sequência das datas e estados finais', async () => {
    await expect(
      contexto('PAGA').editar.execute(1, { status: 'ESTORNADA' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      contexto('PAGA').editar.execute(1, {
        status: 'ESTORNADA',
        motivoEstorno: 'Ajuste',
        dataEstorno: '2026-01-01T10:00:00Z',
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    await expect(
      contexto('CANCELADA').editar.execute(1, { status: 'PAGA' }),
    ).rejects.toBeInstanceOf(ConflictException);
    const c = contexto('PAGA');
    await c.editar.execute(1, { status: 'ESTORNADA', motivoEstorno: 'Ajuste validado' });
    expect(c.tx.comissao.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          status: 'ESTORNADA',
          motivoEstorno: 'Ajuste validado',
          dataEstorno: expect.any(Date),
        }),
      }),
    );
  });
  it('impede datas avulsas e traduz duplicidade do item', async () => {
    await expect(
      contexto('PAGA').editar.execute(1, { dataPagamento: '2026-01-04T10:00:00Z' }),
    ).rejects.toBeInstanceOf(BadRequestException);
    const c = contexto();
    c.tx.comissao.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('duplicado', {
        code: 'P2002',
        clientVersion: 'teste',
      }),
    );
    await expect(
      c.criar.execute({ idAgendamentoServico: 5, idBarbeiro: 9, percentualAplicado: 50 }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
