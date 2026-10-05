import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { dataLocal, instanteLocal, validarExpediente } from './constants/expediente';
import { ListarHorariosDisponiveisAgendamentoService } from './service/listar-horarios-disponiveis-agendamento.service';
import { ValidarVinculosAgendamentoService } from './validations/validar-vinculos-agendamento.service';
import { PrepararItensAgendamentoService } from './validations/preparar-itens-agendamento.service';

const dia = '2030-01-07'; // Segunda-feira.
const agora = new Date('2030-01-07T11:45:00Z');
describe('Expediente e disponibilidade', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(agora);
  });
  afterEach(() => jest.useRealTimers());
  it('converte a data pelo fuso de São Paulo independentemente do processo', () => {
    expect(instanteLocal(dia, 540).toISOString()).toBe('2030-01-07T12:00:00.000Z');
    expect(dataLocal(new Date('2030-01-07T01:00:00Z'))).toBe('2030-01-06');
  });
  it.each([
    ['2030-01-06T12:00:00Z', '2030-01-06T12:30:00Z'], // Domingo.
    ['2030-01-07T11:30:00Z', '2030-01-07T12:30:00Z'], // Passado/antes de abrir.
    ['2030-01-07T20:30:00Z', '2030-01-07T21:01:00Z'], // Ultrapassa fechamento.
    ['2030-01-07T12:15:00Z', '2030-01-07T12:45:00Z'], // Fora da grade.
  ])('rejeita início/fim fora do expediente: %s', (inicio, fim) => {
    expect(() => validarExpediente(new Date(inicio), new Date(fim))).toThrow(BadRequestException);
  });
  it('aceita terminar exatamente no fechamento', () => {
    expect(() =>
      validarExpediente(new Date('2030-01-07T20:30:00Z'), new Date('2030-01-07T21:00:00Z')),
    ).not.toThrow();
  });
  function preparar(ocupados: { inicioPrevisto: Date; fimPrevisto: Date }[] = []) {
    const prisma = {
      servico: {
        findMany: jest.fn().mockResolvedValue([
          { id: 1, ativo: true, precoBase: new Prisma.Decimal('30.10'), duracaoMinutos: 30 },
          { id: 2, ativo: true, precoBase: new Prisma.Decimal('20.20'), duracaoMinutos: 15 },
        ]),
      },
      agendamento: { findMany: jest.fn().mockResolvedValue(ocupados) },
    };
    const vinculos = { validarProfissional: jest.fn() };
    return {
      prisma,
      service: new ListarHorariosDisponiveisAgendamentoService(
        prisma as never,
        new PrepararItensAgendamentoService(prisma as never),
        vinculos as never,
      ),
    };
  }
  it('soma serviços, exclui sobreposição e permite iniciar no fim de outro atendimento', async () => {
    const { service, prisma } = preparar([
      {
        inicioPrevisto: new Date('2030-01-07T12:30:00Z'),
        fimPrevisto: new Date('2030-01-07T13:00:00Z'),
      },
    ]);
    const resposta = await service.execute({
      data: dia,
      idFilial: 1,
      idBarbeiro: 2,
      servicoIds: [1, 2],
    });
    expect(resposta).toMatchObject({
      duracaoTotalMinutos: 45,
      valorTotal: '50.30',
      fuso: 'America/Sao_Paulo',
    });
    expect(resposta.horarios[0].inicio).toBe('2030-01-07T13:00:00.000Z');
    expect(resposta.horarios.at(-1)?.fim).toBe('2030-01-07T20:45:00.000Z');
    expect(prisma.agendamento.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.agendamento.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: ['PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO'] },
        }) as unknown,
      }),
    );
  });
  it('retorna vazio no domingo e rejeita datas inexistentes/passadas', async () => {
    const { service, prisma } = preparar();
    await expect(
      service.execute({ data: '2030-01-13', idFilial: 1, idBarbeiro: 2, servicoIds: [1, 2] }),
    ).resolves.toMatchObject({ horarios: [] });
    expect(prisma.agendamento.findMany).not.toHaveBeenCalled();
    for (const data of ['2030-02-30', '2029-12-31'])
      await expect(
        service.execute({ data, idFilial: 1, idBarbeiro: 2, servicoIds: [1, 2] }),
      ).rejects.toBeInstanceOf(BadRequestException);
  });
  it('não oferece início igual ao instante atual', async () => {
    jest.setSystemTime(new Date('2030-01-07T12:00:00Z'));
    const { service } = preparar();
    const resultado = await service.execute({
      data: dia,
      idFilial: 1,
      idBarbeiro: 2,
      servicoIds: [1, 2],
    });
    expect(resultado.horarios[0].inicio).toBe('2030-01-07T12:30:00.000Z');
  });
});

describe('Vínculos e serviços disponíveis', () => {
  it.each([
    ['INATIVA', 'ATIVO', 'ATIVO', 1],
    ['ATIVA', 'INATIVO', 'ATIVO', 1],
    ['ATIVA', 'ATIVO', 'INATIVO', 1],
    ['ATIVA', 'ATIVO', 'ATIVO', 9],
  ])(
    'rejeita vínculo indisponível: %s %s %s %s',
    async (status, statusProfissional, statusUsuario, idFilial) => {
      const service = new ValidarVinculosAgendamentoService({
        filial: { findUnique: jest.fn().mockResolvedValue({ status }) },
        barbeiro: {
          findUnique: jest.fn().mockResolvedValue({
            statusProfissional,
            idFilial,
            usuario: { status: statusUsuario },
          }),
        },
      } as never);
      await expect(service.validarProfissional(2, 1)).rejects.toBeInstanceOf(BadRequestException);
    },
  );
  it('distingue serviço inativo de inexistente', async () => {
    const findMany = jest.fn().mockResolvedValue([{ id: 1, ativo: false }]);
    const service = new PrepararItensAgendamentoService({ servico: { findMany } } as never);
    await expect(service.execute(undefined, [1])).rejects.toBeInstanceOf(BadRequestException);
    findMany.mockResolvedValue([]);
    await expect(service.execute(undefined, [1])).rejects.toBeInstanceOf(NotFoundException);
  });
});
