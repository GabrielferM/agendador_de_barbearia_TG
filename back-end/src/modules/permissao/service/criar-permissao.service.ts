import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarPermissaoDto } from '../dto/permissao.dto';

@Injectable()
export class CriarPermissaoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CriarPermissaoDto) {
    try {
      return await this.prisma.permissao.create({
        data: {
          codigo: dto.codigo.trim().toUpperCase(),
          nome: dto.nome.trim(),
          descricao: dto.descricao?.trim(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Código de permissão já cadastrado.');
      }
      throw error;
    }
  }
}
