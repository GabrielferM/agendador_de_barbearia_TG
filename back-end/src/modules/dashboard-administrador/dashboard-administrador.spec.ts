import { HEADERS_METADATA, MODULE_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { PERMISSOES_EXIGIDAS } from '../../common/auth/exigir-permissoes.decorator';
import { AgendamentoDashboardModule } from './agendamento/agendamento-dashboard.module';
import { AgendamentoDashboardController } from './agendamento/controller/agendamento-dashboard.controller';
import { BarbeiroDashboardModule } from './barbeiro/barbeiro-dashboard.module';
import { BarbeiroDashboardController } from './barbeiro/controller/barbeiro-dashboard.controller';
import { ClienteDashboardModule } from './cliente/cliente-dashboard.module';
import { ClienteDashboardController } from './cliente/controller/cliente-dashboard.controller';
import { DashboardAdministradorModule } from './dashboard-administrador.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardController } from './dashboard/controller/dashboard.controller';
import { FinanceiroDashboardModule } from './financeiro/financeiro-dashboard.module';
import { FinanceiroDashboardController } from './financeiro/controller/financeiro-dashboard.controller';
import { ServicosDashboardModule } from './servicos/servicos-dashboard.module';
import { ServicosDashboardController } from './servicos/controller/servicos-dashboard.controller';

describe('DashboardAdministradorModule', () => {
  it('compõe todos os submódulos administrativos', () => {
    const imports = Reflect.getMetadata(
      MODULE_METADATA.IMPORTS,
      DashboardAdministradorModule,
    ) as unknown[];

    expect(imports).toEqual(
      expect.arrayContaining([
        DashboardModule,
        AgendamentoDashboardModule,
        BarbeiroDashboardModule,
        ClienteDashboardModule,
        ServicosDashboardModule,
        FinanceiroDashboardModule,
      ]),
    );
  });

  it.each([
    [DashboardController, 'dashboard/administrador', 'GERENCIAR_AGENDAMENTOS'],
    [
      AgendamentoDashboardController,
      'dashboard/administrador/agendamentos',
      'GERENCIAR_AGENDAMENTOS',
    ],
    [BarbeiroDashboardController, 'dashboard/administrador/barbeiros', 'GERENCIAR_USUARIOS'],
    [ClienteDashboardController, 'dashboard/administrador/clientes', 'GERENCIAR_USUARIOS'],
    [ServicosDashboardController, 'dashboard/administrador/servicos', 'GERENCIAR_SERVICOS'],
    [FinanceiroDashboardController, 'dashboard/administrador/financeiro', 'GERENCIAR_COMISSOES'],
  ])('registra rota e permissão de %p', (controller, rota, permissao) => {
    const metodoObter = Reflect.get(controller.prototype, 'obter') as object;

    expect(Reflect.getMetadata(PATH_METADATA, controller)).toBe(rota);
    expect(Reflect.getMetadata(PERMISSOES_EXIGIDAS, controller)).toEqual([permissao]);
    expect(Reflect.getMetadata(HEADERS_METADATA, metodoObter)).toEqual([
      { name: 'Cache-Control', value: 'no-store' },
    ]);
  });
});
