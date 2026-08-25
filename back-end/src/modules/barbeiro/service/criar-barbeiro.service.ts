import { ConflictException, Injectable } from '@nestjs/common';
import { StatusBarbeiro, TipoPerfil } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { normalizarEmail } from '../../../common/utils/documentos';
import { semSenha } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { ValidarFilialBarbeiroService } from '../validations/validar-filial-barbeiro.service';
import { CriarBarbeiroDto } from '../dto/barbeiro.dto';

@Injectable()
export class CriarBarbeiroService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validarFilial: ValidarFilialBarbeiroService,
  ) {}

  async execute(input: CriarBarbeiroDto) {
    await this.validarFilial.execute(input.idFilial);
    const email = normalizarEmail(input.email);
    if (await this.prisma.usuario.findUnique({ where: { email } }))
      throw new ConflictException('E-mail já cadastrado.');
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: input.nome.trim(),
        email,
        senha: await bcrypt.hash(input.senha, 12),
        tipoPerfil: TipoPerfil.BARBEIRO,
        barbeiro: {
          create: {
            idFilial: input.idFilial,
            descricao: input.descricao?.trim(),
            dataAdmissao: input.dataAdmissao ? new Date(input.dataAdmissao) : null,
            status: input.status ?? StatusBarbeiro.ATIVO,
          },
        },
      },
      include: { barbeiro: { include: { filial: true } } },
    });
    return { ...usuario.barbeiro!, usuario: semSenha(usuario) };
  }
}
