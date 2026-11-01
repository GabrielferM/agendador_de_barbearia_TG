import { EditarAgendamentoService } from './editar-agendamento.service';
import type { UsuarioAutenticado } from '../../../common/auth/auth.types';
import { Prisma } from '@prisma/client';

const usuario: UsuarioAutenticado = { id: 2, barbeiroId: 2, papel: 'BARBEIRO', nome: 'Profissional', email: 'teste@local', sessaoId: 'teste', permissoes: ['GERENCIAR_PROPRIA_AGENDA'] };
describe('transição autenticada e atômica', () => {
  const atual = { id: 1, idBarbeiro: 2, status: 'CONFIRMADO', inicioPrevisto: new Date(), servicos: [], inicioReal: null, fimReal: null };
  const tx = { agendamento: { findUnique: jest.fn(), update: jest.fn() }, historicoStatusAgendamento: { create: jest.fn() } };
  const prisma = { $transaction: jest.fn() };
  const service = new EditarAgendamentoService(prisma as never, {} as never, {} as never, {} as never, {} as never);
  beforeEach(() => {
    jest.clearAllMocks();
    tx.agendamento.findUnique.mockResolvedValue(atual);
    tx.agendamento.update.mockResolvedValue({ ...atual, status: 'EM_ATENDIMENTO' });
    tx.historicoStatusAgendamento.create.mockResolvedValue({});
    prisma.$transaction.mockImplementation((fn: (t: typeof tx) => unknown) => fn(tx));
  });
  it('grava início e histórico com responsável e estado anterior do servidor na mesma transação', async () => {
    await service.execute(1, { status: 'EM_ATENDIMENTO' }, usuario);
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), { isolationLevel: 'Serializable' });
    expect(tx.agendamento.update).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ inicioReal: expect.any(Date) }) }));
    expect(tx.historicoStatusAgendamento.create).toHaveBeenCalledWith({ data: expect.objectContaining({ idUsuarioResponsavel: 2, statusAnterior: 'CONFIRMADO', statusNovo: 'EM_ATENDIMENTO' }) });
  });
  it.each([3, 4])('nega outro barbeiro %s dentro da transação', async (barbeiroId) => {
    await expect(service.execute(1, { status: 'EM_ATENDIMENTO' }, { ...usuario, barbeiroId })).rejects.toThrow('Você não pode alterar');
    expect(tx.agendamento.update).not.toHaveBeenCalled();
  });
  it('nega campos administrativos e transições inválidas', async () => {
    await expect(service.execute(1, { status: 'EM_ATENDIMENTO', inicio: '2030-01-01T12:00:00Z' }, usuario)).rejects.toThrow('Campos não permitidos');
    await expect(service.execute(1, { status: 'CONCLUIDO' }, usuario)).rejects.toThrow('Transição');
    await expect(service.execute(1, { status: 'CANCELADO' }, usuario)).rejects.toThrow('Motivo');
    expect(tx.agendamento.update).not.toHaveBeenCalled();
  });
  it('não substitui início real existente e impede nova alteração em estado final', async () => {
    tx.agendamento.findUnique.mockResolvedValueOnce({ ...atual, inicioReal: new Date() });
    await service.execute(1, { status: 'EM_ATENDIMENTO' }, usuario);
    expect(tx.agendamento.update.mock.calls[0][0].data).not.toHaveProperty('inicioReal');
    tx.agendamento.findUnique.mockResolvedValueOnce({ ...atual, status: 'CONCLUIDO' });
    await expect(service.execute(1, { status: 'CONCLUIDO' }, usuario)).rejects.toThrow('estado final');
  });
  it('propaga falha no histórico para rollback da transação', async () => {
    tx.historicoStatusAgendamento.create.mockRejectedValueOnce(new Error('Falha simulada'));
    await expect(service.execute(1, { status: 'EM_ATENDIMENTO' }, usuario)).rejects.toThrow('Falha simulada');
  });
  it('após conflito serializável relê estado final e não duplica histórico', async () => {
    tx.agendamento.update.mockRejectedValueOnce(new Prisma.PrismaClientKnownRequestError('simulado', { code: 'P2034', clientVersion: '7' }));
    tx.agendamento.findUnique.mockResolvedValueOnce(atual).mockResolvedValueOnce({ ...atual, status: 'EM_ATENDIMENTO' });
    await expect(service.execute(1, { status: 'EM_ATENDIMENTO' }, usuario)).rejects.toThrow('Transição');
    expect(tx.historicoStatusAgendamento.create).not.toHaveBeenCalled();
  });
});
