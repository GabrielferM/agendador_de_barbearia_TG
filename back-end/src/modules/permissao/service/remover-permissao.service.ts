import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarPermissaoService } from './buscar-permissao.service';

@Injectable()
export class RemoverPermissaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPermissaoService,
  ) {}

  async execute(id: number) {
    await this.buscarService.execute(id);
    if (await this.prisma.papelPermissao.count({ where: { idPermissao: id } })) {
      throw new ConflictException('Permissão possui vínculos que impedem a exclusão.');
    }
    await this.prisma.permissao.delete({ where: { id } });
  }
}
