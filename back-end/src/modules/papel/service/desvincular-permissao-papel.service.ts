import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DesvincularPermissaoPapelService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(idPapel: number, idPermissao: number) {
    try {
      await this.prisma.papelPermissao.delete({
        where: { idPapel_idPermissao: { idPapel, idPermissao } },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Vínculo não encontrado.');
      }
      throw error;
    }
  }
}
