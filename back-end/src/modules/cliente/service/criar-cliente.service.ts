import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CODIGOS_PAPEL } from '../../../common/constants/papeis';
import { BCRYPT_SALT_ROUNDS } from '../../../common/constants/seguranca';
import { normalizarCpf, normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarClienteDto } from '../dto/cliente.dto';

@Injectable()
export class CriarClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CriarClienteDto) {
    let cpf: string;
    try {
      cpf = normalizarCpf(input.cpf);
    } catch {
      throw new BadRequestException('CPF inválido.');
    }
    const email = normalizarEmail(input.email);
    if (await this.prisma.usuario.findUnique({ where: { email } }))
      throw new ConflictException('E-mail já cadastrado.');
    if (await this.prisma.cliente.findUnique({ where: { cpf } }))
      throw new ConflictException('CPF já cadastrado.');
    const papel = await this.prisma.papel.findUnique({ where: { codigo: CODIGOS_PAPEL.CLIENTE } });
    if (!papel) throw new ConflictException('Papel CLIENTE não configurado.');
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: input.nome.trim(),
        email,
        senhaHash: await bcrypt.hash(input.senha, BCRYPT_SALT_ROUNDS),
        telefone: input.telefone?.trim(),
        idPapel: papel.id,
        cliente: {
          create: {
            cpf,
            dataNascimento: input.dataNascimento ? new Date(input.dataNascimento) : null,
            observacao: input.observacao?.trim(),
          },
        },
      },
      include: { cliente: true },
    });
    return { ...usuario.cliente!, usuario: semSenha(usuario) };
  }
}
