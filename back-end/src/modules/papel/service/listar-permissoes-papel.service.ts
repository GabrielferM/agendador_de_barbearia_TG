import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarPapelService } from './buscar-papel.service';

@Injectable()
export class ListarPermissoesPapelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPapelService,
  ) {}

  async execute(idPapel: number) {
    await this.buscarService.execute(idPapel);
    return this.prisma.papelPermissao.findMany({
      where: { idPapel },
      include: { permissao: true },
      orderBy: { idPermissao: 'asc' },
    });
  }
}
