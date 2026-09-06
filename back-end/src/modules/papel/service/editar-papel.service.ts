import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarPapelDto } from '../dto/papel.dto';
import { BuscarPapelService } from './buscar-papel.service';

@Injectable()
export class EditarPapelService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPapelService,
  ) {}

  async execute(id: number, dto: AtualizarPapelDto) {
    await this.buscarService.execute(id);
    try {
      return await this.prisma.papel.update({
        where: { id },
        data: {
          ...(dto.codigo !== undefined ? { codigo: dto.codigo.trim().toUpperCase() } : {}),
          ...(dto.nome !== undefined ? { nome: dto.nome.trim() } : {}),
          ...(dto.descricao !== undefined ? { descricao: dto.descricao.trim() } : {}),
          ...(dto.ativo !== undefined ? { ativo: dto.ativo } : {}),
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
