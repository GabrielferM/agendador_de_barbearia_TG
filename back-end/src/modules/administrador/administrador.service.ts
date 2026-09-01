import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CODIGOS_PAPEL } from '../../common/constants/papeis';
import { BCRYPT_SALT_ROUNDS } from '../../common/constants/seguranca';
import { respostaPaginada } from '../../common/dto/paginacao.dto';
import { normalizarEmail } from '../../common/utils/documentos';
import { semSenha } from '../../common/utils/resposta';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AtualizarAdministradorDto,
  CriarAdministradorDto,
  ListarAdministradoresDto,
} from './dto/administrador.dto';

const includeAdministrador = { usuario: true } as const;
const apresentar = <T extends { usuario: { senhaHash: string } }>(administrador: T) => ({
  ...administrador,
  usuario: semSenha(administrador.usuario),
});

@Injectable()
export class AdministradorService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(dto: CriarAdministradorDto) {
    const email = normalizarEmail(dto.email);
    const papel = await this.prisma.papel.findUnique({
      where: { codigo: CODIGOS_PAPEL.ADMINISTRADOR },
    });
    if (!papel) throw new ConflictException('Papel ADMINISTRADOR não configurado.');
    try {
      const usuario = await this.prisma.usuario.create({
        data: {
          idPapel: papel.id,
          nome: dto.nome.trim(),
          email,
          senhaHash: await bcrypt.hash(dto.senha, BCRYPT_SALT_ROUNDS),
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
      return apresentar(usuario.administrador!);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('E-mail já cadastrado.');
      throw error;
    }
  }

  async listar(query: ListarAdministradoresDto) {
    const where = query.status ? { usuario: { status: query.status } } : {};
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.administrador.findMany({
        where,
        include: includeAdministrador,
        skip: (query.pagina - 1) * query.limite,
        take: query.limite,
        orderBy: { id: 'asc' },
      }),
      this.prisma.administrador.count({ where }),
    ]);
    return respostaPaginada(dados.map(apresentar), total, query.pagina, query.limite);
  }

  async buscar(id: number) {
    const administrador = await this.prisma.administrador.findUnique({
      where: { id },
      include: includeAdministrador,
    });
    if (!administrador) throw new NotFoundException('Administrador não encontrado.');
    return apresentar(administrador);
  }

  async atualizar(id: number, dto: AtualizarAdministradorDto) {
    await this.buscar(id);
    const usuario: Prisma.UsuarioUpdateWithoutAdministradorInput = {};
    if (dto.nome !== undefined) usuario.nome = dto.nome.trim();
    if (dto.email !== undefined) usuario.email = normalizarEmail(dto.email);
    if (dto.senha !== undefined)
      usuario.senhaHash = await bcrypt.hash(dto.senha, BCRYPT_SALT_ROUNDS);
    if (dto.telefone !== undefined) usuario.telefone = dto.telefone.trim();
    if (dto.status !== undefined) usuario.status = dto.status;
    try {
      const administrador = await this.prisma.administrador.update({
        where: { id },
        data: {
          ...(Object.keys(usuario).length ? { usuario: { update: usuario } } : {}),
          ...(dto.dataInicioAdministracao !== undefined
            ? { dataInicioAdministracao: new Date(dto.dataInicioAdministracao) }
            : {}),
          ...(dto.observacao !== undefined ? { observacao: dto.observacao.trim() } : {}),
        },
        include: includeAdministrador,
      });
      return apresentar(administrador);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('E-mail já cadastrado.');
      throw error;
    }
  }

  async remover(id: number) {
    await this.buscar(id);
    try {
      await this.prisma.usuario.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003')
        throw new ConflictException('Administrador possui vínculos que impedem a exclusão.');
      throw error;
    }
  }
}
