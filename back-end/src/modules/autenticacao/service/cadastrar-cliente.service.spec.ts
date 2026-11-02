import { ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CadastrarClienteService } from './cadastrar-cliente.service';
import { CriarClienteService } from '../../cliente/service/criar-cliente.service';

describe('Cadastro público', () => {
  const entrada = {
    nome: 'Cliente',
    email: 'CLIENTE@example.com',
    cpf: '52998224725',
    senha: 'senha longa segura',
  };
  it('projeta campos permitidos e sanitiza todos os conflitos', async () => {
    const criar = { execute: jest.fn().mockResolvedValue({ senhaHash: 'privado' }) };
    const service = new CadastrarClienteService(criar as never);
    await expect(service.execute({ ...entrada, idPapel: 1 } as never)).resolves.toEqual({
      mensagem: 'Conta criada. Entre para continuar.',
    });
    expect(criar.execute).toHaveBeenCalledWith({ ...entrada, telefone: undefined });
    for (const erro of [
      new ConflictException('CPF já cadastrado'),
      new Prisma.PrismaClientKnownRequestError('privado', {
        code: 'P2002',
        clientVersion: 'teste',
      }),
    ]) {
      criar.execute.mockRejectedValueOnce(erro);
      await expect(service.execute(entrada)).rejects.toThrow(
        'Não foi possível criar a conta com os dados informados.',
      );
    }
  });
  it('reutiliza criação atômica Usuario+Cliente e papel CLIENTE ativo', async () => {
    const prisma = {
      usuario: {
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue({ cliente: { id: 7 } }),
      },
      cliente: { findUnique: jest.fn().mockResolvedValue(null) },
      papel: { findUnique: jest.fn().mockResolvedValue({ id: 3, ativo: true }) },
    };
    const service = new CriarClienteService(
      prisma as never,
      { gerarHash: jest.fn().mockResolvedValue('hash') } as never,
    );
    await service.execute(entrada);
    expect(prisma.papel.findUnique).toHaveBeenCalledWith({ where: { codigo: 'CLIENTE' } });
    const gravacao = (prisma.usuario.create.mock.calls as unknown[][])[0][0] as {
      data: { idPapel: number; email: string; cliente: { create: { cpf: string } } };
    };
    expect(gravacao.data.idPapel).toBe(3);
    expect(gravacao.data.email).toBe('cliente@example.com');
    expect(gravacao.data.cliente.create.cpf).toBe('52998224725');
    prisma.papel.findUnique.mockResolvedValue({ id: 3, ativo: false });
    await expect(service.execute(entrada)).rejects.toThrow();
    expect(prisma.usuario.create).toHaveBeenCalledTimes(1);
  });
});
