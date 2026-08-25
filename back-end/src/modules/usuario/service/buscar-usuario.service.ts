import { Injectable, NotFoundException } from '@nestjs/common';
import { TipoPerfil } from '@prisma/client';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BuscarUsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number) {
    const usuario = await this.prisma.usuario.findUnique({ where: { id } });
    if (!usuario || usuario.tipoPerfil !== TipoPerfil.ADMIN)
      throw new NotFoundException('Usuário não encontrado.');
    return semSenha(usuario);
  }
}
