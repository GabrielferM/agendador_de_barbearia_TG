import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RemoverClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    if (!(await this.prisma.cliente.findUnique({ where: { id } })))
      throw new NotFoundException('Cliente não encontrado.');
    if (await this.prisma.agendamento.count({ where: { idCliente: id } }))
      throw new ConflictException('Cliente possui agendamentos vinculados.');
    try {
      await this.prisma.usuario.delete({ where: { id } });
    } catch (erro) {
      if (erro instanceof Prisma.PrismaClientKnownRequestError) {
        if (erro.code === 'P2003')
          throw new ConflictException('Cliente possui vínculos que impedem a exclusão.');
        if (erro.code === 'P2025') throw new NotFoundException('Cliente não encontrado.');
      }
      throw erro;
    }
  }
}
