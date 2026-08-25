import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CriarEnderecoDto } from '../dto/endereco.dto';

@Injectable()
export class CriarEnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(input: CriarEnderecoDto) {
    return this.prisma.endereco.create({
      data: { ...input, cep: input.cep.replace(/\D/g, ''), estado: input.estado.toUpperCase() },
    });
  }
}
