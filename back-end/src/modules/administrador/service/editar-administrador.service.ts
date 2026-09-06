import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { SenhaService } from '../../../common/security/senha.service';
import { normalizarEmail } from '../../../common/utils/documentos';
import { PrismaService } from '../../../prisma/prisma.service';
import { AtualizarAdministradorDto } from '../dto/administrador.dto';
import {
  apresentarAdministrador,
  includeAdministrador,
} from '../utils/apresentar-administrador.utils';
import { BuscarAdministradorService } from './buscar-administrador.service';

@Injectable()
export class EditarAdministradorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscarService: BuscarAdministradorService,
    private readonly senhas: SenhaService,
  ) {}

  async execute(id: number, dto: AtualizarAdministradorDto) {
    await this.buscarService.execute(id);
    const usuario: Prisma.UsuarioUpdateWithoutAdministradorInput = {};
    if (dto.nome !== undefined) usuario.nome = dto.nome.trim();
    if (dto.email !== undefined) usuario.email = normalizarEmail(dto.email);
    if (dto.senha !== undefined) usuario.senhaHash = await this.senhas.gerarHash(dto.senha);
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
      return apresentarAdministrador(administrador);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('E-mail já cadastrado.');
      }
      throw error;
    }
  }
}
