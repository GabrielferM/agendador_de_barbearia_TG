import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { DashboardBarbeiroController } from './dashboard-barbeiro.controller';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';

@Module({
  imports: [PrismaModule],
  controllers: [DashboardBarbeiroController],
  providers: [DashboardBarbeiroService],
})
export class DashboardBarbeiroModule {}
