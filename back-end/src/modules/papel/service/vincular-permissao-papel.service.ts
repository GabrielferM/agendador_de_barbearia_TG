import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarPapelService } from './buscar-papel.service';

@Injectable()
export class VincularPermissaoPapelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPapelService,
  ) {}

  async execute(idPapel: number, idPermissao: number) {
    await this.buscarService.execute(idPapel);
    if (!(await this.prisma.permissao.findUnique({ where: { id: idPermissao } }))) {
      throw new NotFoundException('Permissão não encontrada.');
    }
    try {
      return await this.prisma.papelPermissao.create({ data: { idPapel, idPermissao } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Permissão já vinculada ao papel.');
      }
      throw error;
    }
  }
}
