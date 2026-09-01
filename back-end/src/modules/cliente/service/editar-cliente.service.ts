import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from '../../../common/constants/seguranca';
import { normalizarCpf, normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarClienteService } from './buscar-cliente.service';
import { AtualizarClienteDto } from '../dto/cliente.dto';

@Injectable()
export class EditarClienteService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarClienteService,
  ) {}

  async execute(id: number, input: AtualizarClienteDto) {
    await this.buscar.execute(id);
    const data: Prisma.ClienteUpdateInput = {};
    if (input.cpf !== undefined) {
      try {
        data.cpf = normalizarCpf(input.cpf);
      } catch {
        throw new BadRequestException('CPF inválido.');
      }
    }
    if (input.dataNascimento !== undefined) data.dataNascimento = new Date(input.dataNascimento);
    if (input.observacao !== undefined) data.observacao = input.observacao.trim();
    const usuario: Prisma.UsuarioUpdateWithoutClienteInput = {};
    if (input.nome !== undefined) usuario.nome = input.nome.trim();
    if (input.email !== undefined) usuario.email = normalizarEmail(input.email);
    if (input.senha !== undefined)
      usuario.senhaHash = await bcrypt.hash(input.senha, BCRYPT_SALT_ROUNDS);
    if (input.telefone !== undefined) usuario.telefone = input.telefone.trim();
    if (Object.keys(usuario).length) data.usuario = { update: usuario };
    try {
      const cliente = await this.prisma.cliente.update({
        where: { id },
        data,
        include: { usuario: true },
      });
      return { ...cliente, usuario: semSenha(cliente.usuario) };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('CPF ou e-mail já cadastrado.');
      throw error;
    }
  }
}
