import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarUsuarioDto } from '../dto/usuario.dto';
import { BuscarUsuarioService } from './buscar-usuario.service';

@Injectable()
export class EditarUsuarioService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarUsuarioService,
  ) {}
  async execute(id: number, dto: AtualizarUsuarioDto) {
    await this.buscar.execute(id);
    const data: Prisma.UsuarioUpdateInput = {};
    if (dto.nome !== undefined) data.nome = dto.nome.trim();
    if (dto.email !== undefined) {
      const email = normalizarEmail(dto.email);
      const existente = await this.prisma.usuario.findUnique({ where: { email } });
      if (existente && existente.id !== id) throw new ConflictException('E-mail já cadastrado.');
      data.email = email;
    }
    if (dto.senha !== undefined) data.senha = await bcrypt.hash(dto.senha, 12);
    return semSenha(await this.prisma.usuario.update({ where: { id }, data }));
  }
}
