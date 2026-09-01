import { BadRequestException } from '@nestjs/common';
import { BuscarServicosAgendamentoService } from './validations/buscar-servicos-agendamento.service';
import { ValidarDataHoraAgendamentoService } from './validations/validar-data-hora-agendamento.service';
import { PrepararItensAgendamentoService } from './validations/preparar-itens-agendamento.service';
import { transicoesStatusAgendamento } from './constants/transicoes-status-agendamento';
import { StatusAgendamento, Prisma } from '@prisma/client';
import { HistoricoStatusAgendamentoService } from './service/historico-status-agendamento.service';

describe('AgendamentoService', () => {
  it('rejeita serviços duplicados antes de consultar o banco', async () => {
    const service = new BuscarServicosAgendamentoService({} as never);

    await expect(service.execute([1, 1])).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejeita início sem fuso horário', () => {
    const service = new ValidarDataHoraAgendamentoService();

    expect(() => service.execute('2030-01-01T12:00:00')).toThrow(BadRequestException);
  });

  it('congela preço, desconto e subtotal dos itens', async () => {
    const service = new PrepararItensAgendamentoService({
      servico: {
        findMany: jest
          .fn()
          .mockResolvedValue([
            { id: 1, precoBase: new Prisma.Decimal('50.00'), duracaoMinutos: 30 },
          ]),
      },
    } as never);

    const [item] = await service.execute([{ idServico: 1, quantidade: 2, desconto: 5 }]);

    expect(item).toMatchObject({
      idServico: 1,
      quantidade: 2,
      duracaoAplicadaMinutos: 30,
      ordemExecucao: 1,
    });
    expect(item.subtotal.toString()).toBe('95');
  });

  it('aceita a transição de pendente para confirmado', () => {
    expect(transicoesStatusAgendamento[StatusAgendamento.PENDENTE]).toContain(
      StatusAgendamento.CONFIRMADO,
    );
  });

  it('pagina o histórico com os parâmetros recebidos', async () => {
    const findMany = jest.fn();
    const count = jest.fn();
    const service = new HistoricoStatusAgendamentoService({
      agendamento: { findUnique: jest.fn().mockResolvedValue({ id: 1 }) },
      historicoStatusAgendamento: { findMany, count },
      $transaction: jest.fn().mockResolvedValue([[], 3]),
    } as never);

    const resposta = await service.listar(1, { pagina: 2, limite: 10 });

    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ skip: 10, take: 10, orderBy: { dataAlteracao: 'desc' } }),
    );
    expect(count).toHaveBeenCalledWith({ where: { idAgendamento: 1 } });
    expect(resposta.meta).toEqual({ pagina: 2, limite: 10, total: 3, totalPaginas: 1 });
  });
});
