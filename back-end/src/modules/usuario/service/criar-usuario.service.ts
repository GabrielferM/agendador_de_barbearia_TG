import { ConflictException, Injectable } from '@nestjs/common';
import { TipoPerfil } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarUsuarioDto } from '../dto/usuario.dto';

@Injectable()
export class CriarUsuarioService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(dto: CriarUsuarioDto) {
    if (dto.tipoPerfil !== TipoPerfil.ADMIN)
      throw new ConflictException('Clientes e barbeiros devem ser criados pelos próprios módulos.');
    const email = normalizarEmail(dto.email);
    if (await this.prisma.usuario.findUnique({ where: { email } }))
      throw new ConflictException('E-mail já cadastrado.');
    return semSenha(
      await this.prisma.usuario.create({
        data: {
          nome: dto.nome.trim(),
          email,
          senha: await bcrypt.hash(dto.senha, 12),
          tipoPerfil: TipoPerfil.ADMIN,
        },
      }),
    );
  }
}
