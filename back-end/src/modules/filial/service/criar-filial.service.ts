import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { normalizarCnpj, normalizarEmail } from '../../../common/utils/documentos';
import { PrismaService } from '../../../prisma/prisma.service';
import { NormalizarEnderecoFilialService } from '../validations/normalizar-endereco-filial.service';
import { CriarFilialDto } from '../dto/filial.dto';

@Injectable()
export class CriarFilialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizarEndereco: NormalizarEnderecoFilialService,
  ) {}

  async execute(input: CriarFilialDto) {
    let cnpj: string;
    try {
      cnpj = normalizarCnpj(input.cnpj);
    } catch {
      throw new BadRequestException('CNPJ inválido.');
    }
    if (await this.prisma.filial.findUnique({ where: { cnpj } }))
      throw new ConflictException('CNPJ já cadastrado.');
    try {
      return await this.prisma.filial.create({
        data: {
          nome: input.nome.trim(),
          cnpj,
          telefone: input.telefone?.trim(),
          email: input.email ? normalizarEmail(input.email) : null,
          horarioAbertura: input.horarioAbertura,
          horarioFechamento: input.horarioFechamento,
          endereco: { create: this.normalizarEndereco.execute(input.endereco) },
        },
        include: { endereco: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('CNPJ já cadastrado.');
      throw error;
    }
  }
}
