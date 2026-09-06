import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CODIGOS_PAPEL } from '../../../common/constants/papeis';
import { SenhaService } from '../../../common/security/senha.service';
import { normalizarEmail } from '../../../common/utils/documentos';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarAdministradorDto } from '../dto/administrador.dto';
import {
  apresentarAdministrador,
  includeAdministrador,
} from '../utils/apresentar-administrador.utils';

@Injectable()
export class CriarAdministradorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly senhas: SenhaService,
  ) {}

  async execute(dto: CriarAdministradorDto) {
    const papel = await this.prisma.papel.findUnique({
      where: { codigo: CODIGOS_PAPEL.ADMINISTRADOR },
    });
    if (!papel) throw new ConflictException('Papel ADMINISTRADOR não configurado.');
    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          idPapel: papel.id,
          nome: dto.nome.trim(),
          email: normalizarEmail(dto.email),
          senhaHash: await this.senhas.gerarHash(dto.senha),
          telefone: dto.telefone?.trim(),
          administrador: {
            create: {
              dataInicioAdministracao: dto.dataInicioAdministracao
                ? new Date(dto.dataInicioAdministracao)
                : null,
              observacao: dto.observacao?.trim(),
            },
          },
        },
        include: { administrador: { include: includeAdministrador } },
      });
      return apresentarAdministrador(usuario.administrador!);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado.');
      }
      throw error;
    }
  }
}
