import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { respostaPaginada } from '../../common/dto/paginacao.dto';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AtualizarPapelDto,
  AtualizarPapelPermissaoDto,
  CriarPapelDto,
  ListarPapeisDto,
} from './dto/papel.dto';

@Injectable()
export class PapelService {
  constructor(private readonly prisma: PrismaService) {}
  async criar(dto: CriarPapelDto) {
    try {
      return await this.prisma.papel.create({
        data: {
          codigo: dto.codigo.trim().toUpperCase(),
          nome: dto.nome.trim(),
          descricao: dto.descricao?.trim(),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Código de papel já cadastrado.');
      throw e;
    }
  }
  async listar(query: ListarPapeisDto) {
    const where = query.ativo === undefined ? {} : { ativo: query.ativo };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.papel.findMany({
        where,
        orderBy: { codigo: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.papel.count({ where }),
    ]);
    return respostaPaginada(data, total, query.pagina, query.limite);
  }
  async buscar(id: number) {
    const papel = await this.prisma.papel.findUnique({ where: { id } });
    if (!papel) throw new NotFoundException('Papel não encontrado.');
    return papel;
  }
  async atualizar(id: number, dto: AtualizarPapelDto) {
    await this.buscar(id);
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Código de papel já cadastrado.');
      throw e;
    }
  }
  async remover(id: number) {
    await this.buscar(id);
    const [usuarios, vinculos] = await this.prisma.$transaction([
      this.prisma.usuario.count({ where: { idPapel: id } }),
      this.prisma.papelPermissao.count({ where: { idPapel: id } }),
    ]);
    if (usuarios || vinculos)
      throw new ConflictException('Papel possui vínculos que impedem a exclusão.');
    await this.prisma.papel.delete({ where: { id } });
  }
  async listarPermissoes(idPapel: number) {
    await this.buscar(idPapel);
    return this.prisma.papelPermissao.findMany({
      where: { idPapel },
      include: { permissao: true },
      orderBy: { idPermissao: 'asc' },
    });
  }
  async vincular(idPapel: number, idPermissao: number) {
    await this.buscar(idPapel);
    if (!(await this.prisma.permissao.findUnique({ where: { id: idPermissao } })))
      throw new NotFoundException('Permissão não encontrada.');
    try {
      return await this.prisma.papelPermissao.create({ data: { idPapel, idPermissao } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Permissão já vinculada ao papel.');
      throw e;
    }
  }
  async atualizarVinculo(idPapel: number, idPermissao: number, dto: AtualizarPapelPermissaoDto) {
    try {
      return await this.prisma.papelPermissao.update({
        where: { idPapel_idPermissao: { idPapel, idPermissao } },
        data: dto,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')
        throw new NotFoundException('Vínculo não encontrado.');
      throw e;
    }
  }
  async desvincular(idPapel: number, idPermissao: number) {
    try {
      await this.prisma.papelPermissao.delete({
        where: { idPapel_idPermissao: { idPapel, idPermissao } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025')
        throw new NotFoundException('Vínculo não encontrado.');
      throw e;
    }
  }
}
