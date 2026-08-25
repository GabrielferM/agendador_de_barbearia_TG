import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarBarbeiroService } from './buscar-barbeiro.service';
import { ValidarFilialBarbeiroService } from '../validations/validar-filial-barbeiro.service';
import { AtualizarBarbeiroDto } from '../dto/barbeiro.dto';

@Injectable()
export class EditarBarbeiroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarBarbeiroService,
    private readonly validarFilial: ValidarFilialBarbeiroService,
  ) {}

  async execute(id: number, input: AtualizarBarbeiroDto) {
    await this.buscar.execute(id);
    if (input.idFilial !== undefined) await this.validarFilial.execute(input.idFilial);
    const data: Prisma.BarbeiroUpdateInput = {};
    if (input.idFilial !== undefined) data.filial = { connect: { id: input.idFilial } };
    if (input.descricao !== undefined) data.descricao = input.descricao.trim();
    if (input.dataAdmissao !== undefined) data.dataAdmissao = new Date(input.dataAdmissao);
    if (input.status !== undefined) data.status = input.status;
    const usuario: Prisma.UsuarioUpdateWithoutBarbeiroInput = {};
    if (input.nome !== undefined) usuario.nome = input.nome.trim();
    if (input.email !== undefined) usuario.email = normalizarEmail(input.email);
    if (input.senha !== undefined) usuario.senha = await bcrypt.hash(input.senha, 12);
    if (Object.keys(usuario).length) data.usuario = { update: usuario };
    try {
      const barbeiro = await this.prisma.barbeiro.update({
        where: { id },
        data,
        include: { usuario: true, filial: true },
      });
      return { ...barbeiro, usuario: semSenha(barbeiro.usuario) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('E-mail já cadastrado.');
      throw error;
    }
  }
}
