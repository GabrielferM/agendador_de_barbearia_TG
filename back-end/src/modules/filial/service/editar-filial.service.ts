import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { normalizarCnpj, normalizarEmail } from '../../../common/utils/documentos';
import { PrismaService } from '../../../prisma/prisma.service';
import { NormalizarEnderecoFilialService } from '../validations/normalizar-endereco-filial.service';
import { BuscarFilialService } from './buscar-filial.service';
import { AtualizarFilialDto } from '../dto/filial.dto';

@Injectable()
export class EditarFilialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarFilialService,
    private readonly normalizarEndereco: NormalizarEnderecoFilialService,
  ) {}

  async execute(id: number, input: AtualizarFilialDto) {
    await this.buscar.execute(id);
    const data: Prisma.FilialUpdateInput = {};
    if (input.nome !== undefined) data.nome = input.nome.trim();
    if (input.cnpj !== undefined) {
      try {
        data.cnpj = normalizarCnpj(input.cnpj);
      } catch {
        throw new BadRequestException('CNPJ inválido.');
      }
    }
    if (input.telefone !== undefined) data.telefone = input.telefone.trim();
    if (input.email !== undefined) data.email = normalizarEmail(input.email);
    if (input.status !== undefined) data.status = input.status;
    if (input.endereco) data.endereco = { update: this.normalizarEndereco.execute(input.endereco) };
    try {
      return await this.prisma.filial.update({ where: { id }, data, include: { endereco: true } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
        throw new ConflictException('CNPJ já cadastrado.');
      throw error;
    }
  }
}
