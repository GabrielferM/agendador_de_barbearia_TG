import { Injectable, NotFoundException } from '@nestjs/common';
import { serializarResposta } from '../../../common/utils/resposta';
import { PrismaService } from '../../../prisma/prisma.service';
import { includeAgendamento } from '../constants/include-agendamento';

@Injectable()
export class BuscarAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}
  async execute(id: number) {
    const agendamento = await this.prisma.agendamento.findUnique({
      where: { id },
      include: includeAgendamento,
    });
    if (!agendamento) throw new NotFoundException('Agendamento não encontrado.');
    return serializarResposta(agendamento);
  }
}
