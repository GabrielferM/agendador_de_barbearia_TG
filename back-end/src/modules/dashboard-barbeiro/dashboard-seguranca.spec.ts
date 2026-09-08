import { PERMISSOES_EXIGIDAS } from '../../common/auth/exigir-permissoes.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { DashboardAdministradorController } from '../dashboard-administrador/dashboard-administrador.controller';
import { DashboardBarbeiroController } from './dashboard-barbeiro.controller';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';

describe('segurança dos dashboards', () => {
  it('exige a permissão administrativa no endpoint administrativo', () => {
    expect(Reflect.getMetadata(PERMISSOES_EXIGIDAS, DashboardAdministradorController)).toEqual([
      'GERENCIAR_AGENDAMENTOS',
    ]);
  });

  it('exige a permissão de agenda própria no endpoint do barbeiro', () => {
    expect(Reflect.getMetadata(PERMISSOES_EXIGIDAS, DashboardBarbeiroController)).toEqual([
      'GERENCIAR_PROPRIA_AGENDA',
    ]);
  });

  it('recusa usuário sem perfil de barbeiro antes de consultar dados', async () => {
    const prisma = { $transaction: jest.fn() };
    const service = new DashboardBarbeiroService(prisma as never);
    const usuario = {
      id: 1,
      nome: 'Administrador',
      email: 'admin@exemplo.com',
      papel: 'ADMINISTRADOR',
      permissoes: ['GERENCIAR_PROPRIA_AGENDA'],
      sessaoId: 'sessao',
    } satisfies UsuarioAutenticado;

    await expect(service.obter(usuario)).rejects.toThrow(
      'O usuário não possui perfil de barbeiro.',
    );
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });
});
