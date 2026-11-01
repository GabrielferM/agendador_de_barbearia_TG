import { ConsultarAreaBarbeiroService } from './service/consultar-area-barbeiro.service';
import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardBarbeiroController } from './dashboard-barbeiro.controller';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardBarbeiroController],
  providers: [DashboardBarbeiroService, ConsultarAreaBarbeiroService],
})
export class DashboardBarbeiroModule {}
