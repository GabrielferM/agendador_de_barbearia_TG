import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarPapelService } from './buscar-papel.service';

@Injectable()
export class RemoverPapelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPapelService,
  ) {}

  async execute(id: number) {
    await this.buscarService.execute(id);
    const [usuarios, vinculos] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where: { idPapel: id } }),
      this.prisma.papelPermissao.count({ where: { idPapel: id } }),
    ]);
    if (usuarios || vinculos) {
      throw new ConflictException('Papel possui vínculos que impedem a exclusão.');
    }
    await this.prisma.papel.delete({ where: { id } });
  }
}
