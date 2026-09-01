import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarAgendamentoService } from './buscar-agendamento.service';

@Injectable()
export class RemoverAgendamentoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly buscar: BuscarAgendamentoService,
  ) {}
  async execute(id: number) {
    await this.buscar.execute(id);
    const itensComComissao = await this.prisma.agendamentoServico.count({
      where: { idAgendamento: id, comissao: { isNot: null } },
    });
    if (itensComComissao) throw new ConflictException('Agendamento possui comissões vinculadas.');
    await this.prisma.agendamento.delete({ where: { id } });
  }
}
