import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RemoverClienteService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    if (!(await this.prisma.cliente.findUnique({ where: { id } })))
      throw new NotFoundException('Cliente não encontrado.');
    if (await this.prisma.agendamento.count({ where: { idCliente: id } }))
      throw new ConflictException('Cliente possui agendamentos vinculados.');
    await this.prisma.usuario.delete({ where: { id } });
  }
}
