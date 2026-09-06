import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  apresentarAdministrador,
  includeAdministrador,
} from '../utils/apresentar-administrador.utils';

@Injectable()
export class BuscarAdministradorService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    const administrador = await this.prisma.administrador.findUnique({
      where: { id },
      include: includeAdministrador,
    });
    if (!administrador) throw new NotFoundException('Administrador não encontrado.');
    return apresentarAdministrador(administrador);
  }
}
