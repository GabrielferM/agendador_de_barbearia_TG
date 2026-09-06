import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarPapelPermissaoDto } from '../dto/papel.dto';

@Injectable()
export class EditarVinculoPapelPermissaoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(idPapel: number, idPermissao: number, dto: AtualizarPapelPermissaoDto) {
    try {
      return await this.prisma.papelPermissao.update({
        where: { idPapel_idPermissao: { idPapel, idPermissao } },
        data: dto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Vínculo não encontrado.');
      }
      throw error;
    }
  }
}
