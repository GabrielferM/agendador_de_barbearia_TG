import { ConflictException, Injectable } from '@nestjs/common';
import { StatusBarbeiro } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { CODIGOS_PAPEL } from '../../../common/constants/papeis';
import { BCRYPT_SALT_ROUNDS } from '../../../common/constants/seguranca';
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
    const papel = await this.prisma.papel.findUnique({ where: { codigo: CODIGOS_PAPEL.BARBEIRO } });
    if (!papel) throw new ConflictException('Papel BARBEIRO não configurado.');
    const usuario = await this.prisma.usuario.create({
      data: {
        nome: input.nome.trim(),
        email,
        senhaHash: await bcrypt.hash(input.senha, BCRYPT_SALT_ROUNDS),
        idPapel: papel.id,
        barbeiro: {
          create: {
            idFilial: input.idFilial,
            nomeProfissional: input.nomeProfissional?.trim() || input.nome.trim(),
            descricao: input.descricao?.trim(),
            fotoUrl: input.fotoUrl?.trim(),
            dataAdmissao: input.dataAdmissao ? new Date(input.dataAdmissao) : null,
            statusProfissional: input.statusProfissional ?? StatusBarbeiro.ATIVO,
          },
        },
      },
      include: { barbeiro: { include: { filial: true } } },
    });
    return { ...usuario.barbeiro!, usuario: semSenha(usuario) };
  }
}
