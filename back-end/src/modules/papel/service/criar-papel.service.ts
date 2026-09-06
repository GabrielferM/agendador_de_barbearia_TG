import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarPapelDto } from '../dto/papel.dto';

@Injectable()
export class CriarPapelService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(dto: CriarPapelDto) {
    try {
      return await this.prisma.papel.create({
        data: {
          codigo: dto.codigo.trim().toUpperCase(),
          nome: dto.nome.trim(),
          descricao: dto.descricao?.trim(),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Código de papel já cadastrado.');
      }
      throw error;
    }
  }
}
