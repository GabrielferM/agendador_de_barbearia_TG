import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AgendamentoDashboardModule } from './agendamento/agendamento-dashboard.module';
import { BarbeiroDashboardModule } from './barbeiro/barbeiro-dashboard.module';
import { ClienteDashboardModule } from './cliente/cliente-dashboard.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { FinanceiroDashboardModule } from './financeiro/financeiro-dashboard.module';
import { ServicosDashboardModule } from './servicos/servicos-dashboard.module';

@Module({
  imports: [
    PrismaModule,
    DashboardModule,
    AgendamentoDashboardModule,
    BarbeiroDashboardModule,
    ClienteDashboardModule,
    ServicosDashboardModule,
    FinanceiroDashboardModule,
  ],
})
export class DashboardAdministradorModule {}
