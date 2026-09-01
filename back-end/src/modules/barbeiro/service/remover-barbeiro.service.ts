import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RemoverBarbeiroService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number) {
    if (!(await this.prisma.barbeiro.findUnique({ where: { id } })))
      throw new NotFoundException('Barbeiro não encontrado.');
    const [agendamentos, comissoes] = await this.prisma.$transaction([
      this.prisma.agendamento.count({ where: { idBarbeiro: id } }),
      this.prisma.comissao.count({ where: { idBarbeiro: id } }),
    ]);
    if (agendamentos || comissoes)
      throw new ConflictException('Barbeiro possui vínculos que impedem a exclusão.');
    await this.prisma.usuario.delete({ where: { id } });
  }
}
