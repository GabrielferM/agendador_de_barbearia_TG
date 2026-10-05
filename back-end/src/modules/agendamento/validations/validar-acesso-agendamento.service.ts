import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsuarioAutenticado } from '../../../common/auth/auth.types';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ValidarAcessoAgendamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async execute(id: number, usuario?: UsuarioAutenticado): Promise<void> {
    if (!usuario || usuario.permissoes.includes('GERENCIAR_AGENDAMENTOS')) return;

    const item = await this.prisma.agendamento.findUnique({
      where: { id },
      select: { idCliente: true, idBarbeiro: true },
    });
    if (!item || (item.idCliente !== usuario.clienteId && item.idBarbeiro !== usuario.barbeiroId)) {
      throw new ForbiddenException('Você não pode acessar este agendamento.');
    }
  }
}
