import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarEnderecoService } from './buscar-endereco.service';
import { AtualizarEnderecoDto } from '../dto/endereco.dto';

@Injectable()
export class EditarEnderecoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarEnderecoService,
  ) {}

  async execute(id: number, input: AtualizarEnderecoDto) {
    await this.buscar.execute(id);
    return this.prisma.endereco.update({
      where: { id },
      data: {
        ...input,
        ...(input.cep ? { cep: input.cep.replace(/\D/g, '') } : {}),
        ...(input.estado ? { estado: input.estado.toUpperCase() } : {}),
      },
    });
  }
}
