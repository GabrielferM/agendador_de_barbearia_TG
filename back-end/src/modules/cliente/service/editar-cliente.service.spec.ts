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
  it('permite remover a data de nascimento opcional', async () => {
    const update = jest.fn().mockResolvedValue({ id: 1, usuario: { id: 1 } });
    const servico = new EditarClienteService(
      { cliente: { update } } as unknown as PrismaService,
      { execute: jest.fn() } as unknown as BuscarClienteService,
      {} as SenhaService,
    );
    await servico.execute(1, { dataNascimento: null });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { dataNascimento: null } }),
    );
  });
  it('rejeita status inexistente no DTO', async () => {
    const dto = Object.assign(new AtualizarClienteDto(), { status: 'INVALIDO' });
    expect(await validate(dto)).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'status' })]),
    );
  });
});
