import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { RemoverClienteService } from './remover-cliente.service';

describe('exclusão de clientes', () => {
  it.each(['P2003', 'P2025'])('traduz %s surgido depois da pré-consulta', async (code) => {
    const prisma = {
      cliente: { findUnique: jest.fn().mockResolvedValue({ id: 1 }) },
      agendamento: { count: jest.fn().mockResolvedValue(0) },
      usuario: {
        delete: jest
          .fn()
          .mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('restrição', { code, clientVersion: 'teste' }),
          ),
      },
    };
    const service = new RemoverClienteService(prisma as unknown as PrismaService);
    await expect(service.execute(1)).rejects.toBeInstanceOf(
      code === 'P2003' ? ConflictException : NotFoundException,
    );
  });
});
