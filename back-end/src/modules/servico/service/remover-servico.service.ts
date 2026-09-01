import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RemoverServicoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number) {
    if (!(await this.prisma.servico.findUnique({ where: { id } })))
      throw new NotFoundException('Serviço não encontrado.');
    if (await this.prisma.agendamentoServico.count({ where: { idServico: id } }))
      throw new ConflictException('Serviço possui agendamentos vinculados.');
    await this.prisma.servico.delete({ where: { id } });
  }
}
