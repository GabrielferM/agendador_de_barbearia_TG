import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarPermissaoDto } from '../dto/permissao.dto';
import { BuscarPermissaoService } from './buscar-permissao.service';

@Injectable()
export class EditarPermissaoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarPermissaoService,
  ) {}

  async execute(id: number, dto: AtualizarPermissaoDto) {
    await this.buscarService.execute(id);
    try {
      return await this.prisma.permissao.update({
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
        throw new ConflictException('Código de permissão já cadastrado.');
      }
      throw error;
    }
  }
}
