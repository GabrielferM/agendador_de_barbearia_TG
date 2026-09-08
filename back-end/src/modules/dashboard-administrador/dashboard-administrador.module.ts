import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardAdministradorController } from './dashboard-administrador.controller';
import { DashboardAdministradorService } from './dashboard-administrador.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardAdministradorController],
  providers: [DashboardAdministradorService],
})
export class DashboardAdministradorModule {}
