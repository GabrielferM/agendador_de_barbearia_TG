import { EditarClienteService } from './editar-cliente.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarClienteService } from './buscar-cliente.service';
import { SenhaService } from '../../../common/security/senha.service';
import { validate } from 'class-validator';
import { AtualizarClienteDto } from '../dto/cliente.dto';

describe('Edição administrativa de cliente', () => {
  it('atualiza status junto do usuário e remove hash da resposta', async () => {
    const update = jest.fn().mockResolvedValue({
      id: 1,
      usuario: { id: 1, status: 'INATIVO', senhaHash: 'valor-simulado' },
    });
    const servico = new EditarClienteService(
      { cliente: { update } } as unknown as PrismaService,
      { execute: jest.fn() } as unknown as BuscarClienteService,
      {} as SenhaService,
    );
    const resultado = await servico.execute(1, { status: 'INATIVO' });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { usuario: { update: { status: 'INATIVO' } } } }),
    );
    expect(resultado.usuario).not.toHaveProperty('senhaHash');
  });
  it('rejeita status inexistente no DTO', async () => {
    const dto = Object.assign(new AtualizarClienteDto(), { status: 'INVALIDO' });
    expect(await validate(dto)).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'status' })]),
    );
  });
});

describe('Atualizar aniversário do cliente', () => {
  const atualizar = jest
    .fn<Promise<{ id: number; usuario: { id: number } }>, [{ data: Record<string, unknown> }]>()
    .mockResolvedValue({ id: 1, usuario: { id: 1 } });
  const buscar = { execute: jest.fn().mockResolvedValue({ id: 1 }) };
  const senhas = { gerarHash: jest.fn() };
  const service = new EditarClienteService(
    { cliente: { update: atualizar } } as never,
    buscar as never,
    senhas as never,
  );
  beforeEach(() => jest.clearAllMocks());
  it('mantém quando omitido, grava o par e remove com null', async () => {
    await service.execute(1, { nome: 'Cliente' });
    expect(atualizar.mock.calls[0][0].data).not.toHaveProperty('diaAniversario');
    await service.execute(1, { diaAniversario: 29, mesAniversario: 2 });
    expect(atualizar.mock.calls[1][0].data).toMatchObject({
      diaAniversario: 29,
      mesAniversario: 2,
    });
    await service.execute(1, { diaAniversario: null, mesAniversario: null });
    expect(atualizar.mock.calls[2][0].data).toMatchObject({
      diaAniversario: null,
      mesAniversario: null,
    });
    expect(senhas.gerarHash).not.toHaveBeenCalled();
  });
  it('não grava um par incompleto ou data impossível', async () => {
    await expect(service.execute(1, { diaAniversario: 29 })).rejects.toThrow(
      'Aniversário inválido.',
    );
    await expect(service.execute(1, { diaAniversario: 31, mesAniversario: 4 })).rejects.toThrow(
      'Aniversário inválido.',
    );
    expect(atualizar).not.toHaveBeenCalled();
  });
});
