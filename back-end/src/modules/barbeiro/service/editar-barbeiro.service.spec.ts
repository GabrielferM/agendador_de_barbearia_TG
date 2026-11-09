import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { SenhaService } from '../../../common/security/senha.service';
import { AtualizarBarbeiroDto } from '../dto/barbeiro.dto';
import { BuscarBarbeiroService } from './buscar-barbeiro.service';
import { ValidarFilialBarbeiroService } from '../validations/validar-filial-barbeiro.service';
import { EditarBarbeiroService } from './editar-barbeiro.service';

describe('Edição administrativa de barbeiro', () => {
  const prisma = { barbeiro: { update: jest.fn() } };
  const buscar = { execute: jest.fn() };
  const filial = { execute: jest.fn() };
  const senhas = { gerarHash: jest.fn() };
  const service = new EditarBarbeiroService(
    prisma as unknown as PrismaService,
    buscar as unknown as BuscarBarbeiroService,
    filial as unknown as ValidarFilialBarbeiroService,
    senhas as unknown as SenhaService,
  );
  beforeEach(() => {
    jest.resetAllMocks();
    buscar.execute.mockResolvedValue({ id: 9 });
    prisma.barbeiro.update.mockResolvedValue({
      id: 9,
      statusProfissional: 'AFASTADO',
      usuario: { id: 9, status: 'INATIVO', senhaHash: 'hash-teste' },
    });
  });

  it.each(['ATIVO', 'INATIVO'] as const)(
    'altera a conta para %s sem modificar perfil ou agendamentos',
    async (statusConta) => {
      const resposta = await service.execute(9, { statusConta });
      expect(prisma.barbeiro.update).toHaveBeenCalledWith({
        where: { id: 9 },
        data: { usuario: { update: { status: statusConta } } },
        include: { usuario: true, filial: true },
      });
      expect(resposta.usuario).not.toHaveProperty('senhaHash');
      expect(resposta.statusProfissional).toBe('AFASTADO');
      expect(senhas.gerarHash).not.toHaveBeenCalled();
    },
  );

  it('edita conta e perfil em uma única gravação e preserva senha omitida', async () => {
    await service.execute(9, {
      nome: ' Ana Silva ',
      email: 'ANA@EXEMPLO.COM',
      idFilial: 3,
      descricao: ' Perfil ',
      statusProfissional: 'AFASTADO',
    });
    expect(filial.execute).toHaveBeenCalledWith(3);
    expect(prisma.barbeiro.update).toHaveBeenCalledTimes(1);
    expect(prisma.barbeiro.update).toHaveBeenCalledWith(
      expect.objectContaining({
        data: {
          filial: { connect: { id: 3 } },
          descricao: 'Perfil',
          statusProfissional: 'AFASTADO',
          usuario: { update: { nome: 'Ana Silva', email: 'ana@exemplo.com' } },
        },
      }),
    );
    expect(senhas.gerarHash).not.toHaveBeenCalled();
  });

  it('não grava barbeiro inexistente nem filial inválida', async () => {
    buscar.execute.mockRejectedValueOnce(new NotFoundException());
    await expect(service.execute(99, { statusConta: 'ATIVO' })).rejects.toBeInstanceOf(
      NotFoundException,
    );
    filial.execute.mockRejectedValueOnce(new BadRequestException());
    await expect(service.execute(9, { idFilial: 99 })).rejects.toBeInstanceOf(BadRequestException);
    expect(prisma.barbeiro.update).not.toHaveBeenCalled();
  });

  it('traduz conflito sem expor informação do banco', async () => {
    prisma.barbeiro.update.mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('interno', {
        code: 'P2002',
        clientVersion: 'teste',
      }),
    );
    await expect(service.execute(9, { email: 'ana@exemplo.com' })).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it.each([null, false, 1, 'BLOQUEADO', 'AFASTADO'])(
    'rejeita statusConta inválido %s no DTO',
    async (statusConta) => {
      const erros = await validate(plainToInstance(AtualizarBarbeiroDto, { statusConta }));
      expect(erros.some((erro) => erro.property === 'statusConta')).toBe(true);
    },
  );
});
