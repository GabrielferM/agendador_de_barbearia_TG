import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { respostaPaginada } from '../../common/dto/paginacao.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { AtualizarPermissaoDto, CriarPermissaoDto, ListarPermissoesDto } from './dto/permissao.dto';
@Injectable()
export class PermissaoService {
  constructor(private readonly prisma: PrismaService) {}
  async criar(dto: CriarPermissaoDto) {
    try {
      return await this.prisma.permissao.create({
        data: {
          codigo: dto.codigo.trim().toUpperCase(),
          nome: dto.nome.trim(),
          descricao: dto.descricao?.trim(),
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Código de permissão já cadastrado.');
      throw e;
    }
  }
  async listar(query: ListarPermissoesDto) {
    const where = query.ativo === undefined ? {} : { ativo: query.ativo };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.permissao.findMany({
        where,
        orderBy: { codigo: 'asc' },
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
      }),
      this.prisma.permissao.count({ where }),
    ]);
    return respostaPaginada(data, total, query.pagina, query.limite);
  }
  async buscar(id: number) {
    const permissao = await this.prisma.permissao.findUnique({ where: { id } });
    if (!permissao) throw new NotFoundException('Permissão não encontrada.');
    return permissao;
  }
  async atualizar(id: number, dto: AtualizarPermissaoDto) {
    await this.buscar(id);
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
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
        throw new ConflictException('Código de permissão já cadastrado.');
      throw e;
    }
  }
  async remover(id: number) {
    await this.buscar(id);
    if (await this.prisma.papelPermissao.count({ where: { idPermissao: id } }))
      throw new ConflictException('Permissão possui vínculos que impedem a exclusão.');
    await this.prisma.permissao.delete({ where: { id } });
  }
}
