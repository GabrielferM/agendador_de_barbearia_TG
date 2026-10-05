import { ConflictException, ForbiddenException } from '@nestjs/common';
import { Prisma, StatusAgendamento } from '@prisma/client';
import { executarTransacaoSerializavel } from '../../prisma/transacao';
import { CriarAgendamentoService } from './service/criar-agendamento.service';
import { EditarAgendamentoService } from './service/editar-agendamento.service';
import { ValidarAcessoAgendamentoService } from './validations/validar-acesso-agendamento.service';

const conflitoSerializacao = () =>
  new Prisma.PrismaClientKnownRequestError('Conflito concorrente', {
    code: 'P2034',
    clientVersion: 'test',
  });

describe('Transações de agendamento', () => {
  it('repete uma transação serializável quando o Prisma retorna P2034', async () => {
    const transaction = {} as Prisma.TransactionClient;
    const operacao = jest
      .fn()
      .mockRejectedValueOnce(conflitoSerializacao())
      .mockRejectedValueOnce(conflitoSerializacao())
      .mockResolvedValue('ok');
    const $transaction = jest.fn((callback: (tx: Prisma.TransactionClient) => unknown) =>
      callback(transaction),
    );

    await expect(executarTransacaoSerializavel({ $transaction } as never, operacao)).resolves.toBe(
      'ok',
    );
    expect($transaction).toHaveBeenCalledTimes(3);
    expect($transaction).toHaveBeenLastCalledWith(operacao, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  });

  it('converte em conflito quando a criação esgota as tentativas concorrentes', async () => {
    const prisma = { $transaction: jest.fn().mockRejectedValue(conflitoSerializacao()) };
    const service = new CriarAgendamentoService(
      prisma as never,
      { execute: jest.fn() },
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
      { execute: jest.fn() } as never,
    );

    await expect(
      service.execute({
        idCliente: 1,
        idBarbeiro: 2,
        idFilial: 3,
        inicio: '2030-01-01T12:00:00-03:00',
        servicoIds: [4],
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(prisma.$transaction).toHaveBeenCalledTimes(3);
  });

  it('usa o mesmo cliente transacional nas validações e na criação', async () => {
    const item = {
      idServico: 4,
      precoAplicado: new Prisma.Decimal(50),
      duracaoAplicadaMinutos: 30,
      quantidade: 1,
      desconto: new Prisma.Decimal(0),
      subtotal: new Prisma.Decimal(50),
      ordemExecucao: 1,
    };
    const criar = jest.fn().mockResolvedValue({ id: 10 });
    const transaction = {
      agendamento: { create: criar },
    } as unknown as Prisma.TransactionClient;
    const prisma = {
      $transaction: jest.fn((callback: (tx: Prisma.TransactionClient) => unknown) =>
        callback(transaction),
      ),
    };
    const prepararItens = { execute: jest.fn().mockResolvedValue([item]) };
    const validarVinculos = { execute: jest.fn().mockResolvedValue(undefined) };
    const verificarConflito = { execute: jest.fn().mockResolvedValue(undefined) };
    const service = new CriarAgendamentoService(
      prisma as never,
      { execute: jest.fn((valor: string) => new Date(valor)) },
      prepararItens as never,
      validarVinculos as never,
      verificarConflito as never,
    );

    await service.execute({
      idCliente: 1,
      idBarbeiro: 2,
      idFilial: 3,
      inicio: '2030-01-01T12:00:00-03:00',
      servicoIds: [4],
    });

    expect(prepararItens.execute).toHaveBeenCalledWith(undefined, [4], transaction);
    expect(validarVinculos.execute).toHaveBeenCalledWith(1, 2, 3, transaction);
    expect(verificarConflito.execute).toHaveBeenCalledWith(
      2,
      expect.any(Date),
      expect.any(Date),
      undefined,
      transaction,
    );
    expect(criar).toHaveBeenCalled();
  });

  it('usa o mesmo cliente transacional na leitura, conflito e edição', async () => {
    const editar = jest.fn().mockResolvedValue({ id: 10 });
    const transaction = {
      agendamento: {
        findUnique: jest.fn().mockResolvedValue({
          id: 10,
          idBarbeiro: 2,
          status: StatusAgendamento.PENDENTE,
          inicioPrevisto: new Date('2030-01-01T12:00:00-03:00'),
          servicos: [
            {
              idServico: 4,
              precoAplicado: new Prisma.Decimal(50),
              duracaoAplicadaMinutos: 30,
              quantidade: 1,
              desconto: new Prisma.Decimal(0),
              subtotal: new Prisma.Decimal(50),
              ordemExecucao: 1,
            },
          ],
        }),
        update: editar,
      },
      agendamentoServico: { count: jest.fn() },
    } as unknown as Prisma.TransactionClient;
    const prisma = {
      $transaction: jest.fn((callback: (tx: Prisma.TransactionClient) => unknown) =>
        callback(transaction),
      ),
    };
    const verificarConflito = { execute: jest.fn().mockResolvedValue(undefined) };
    const service = new EditarAgendamentoService(
      prisma as never,
      { execute: jest.fn((valor: string) => new Date(valor)) },
      { execute: jest.fn() } as never,
      verificarConflito as never,
      { execute: jest.fn() } as never,
    );

    await service.execute(10, { inicio: '2030-01-01T13:00:00-03:00' });

    expect(verificarConflito.execute).toHaveBeenCalledWith(
      2,
      expect.any(Date),
      expect.any(Date),
      10,
      transaction,
    );
    expect(editar).toHaveBeenCalled();
  });
});

describe('Acesso a agendamentos', () => {
  it('não consulta o banco para quem gerencia todos os agendamentos', async () => {
    const findUnique = jest.fn();
    const service = new ValidarAcessoAgendamentoService({
      agendamento: { findUnique },
    } as never);

    await service.execute(1, {
      id: 1,
      nome: 'Admin',
      email: 'admin@teste.local',
      papel: 'ADMINISTRADOR',
      permissoes: ['GERENCIAR_AGENDAMENTOS'],
      sessaoId: 'sessao',
    });

    expect(findUnique).not.toHaveBeenCalled();
  });

  it('preserva a resposta proibida quando o recurso não pertence ao usuário', async () => {
    const service = new ValidarAcessoAgendamentoService({
      agendamento: { findUnique: jest.fn().mockResolvedValue({ idCliente: 9, idBarbeiro: 8 }) },
    } as never);

    await expect(
      service.execute(1, {
        id: 1,
        nome: 'Cliente',
        email: 'cliente@teste.local',
        papel: 'CLIENTE',
        permissoes: ['CRIAR_AGENDAMENTO'],
        sessaoId: 'sessao',
        clienteId: 2,
      }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
