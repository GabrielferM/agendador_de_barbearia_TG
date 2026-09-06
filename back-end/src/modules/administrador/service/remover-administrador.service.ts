import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarAdministradorService } from './buscar-administrador.service';

@Injectable()
export class RemoverAdministradorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarAdministradorService,
  ) {}

  async execute(id: number) {
    await this.buscarService.execute(id);
    try {
      await this.prisma.usuario.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException('Administrador possui vínculos que impedem a exclusão.');
      }
      throw error;
    }
  }
}
