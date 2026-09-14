import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { AgendamentoDashboardController } from './controller/agendamento-dashboard.controller';
import { AgendamentoDashboardService } from './services/agendamento-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [AgendamentoDashboardController],
  providers: [AgendamentoDashboardService],
})
export class AgendamentoDashboardModule {}
