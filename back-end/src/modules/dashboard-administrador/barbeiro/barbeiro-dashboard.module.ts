import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { BarbeiroDashboardController } from './controller/barbeiro-dashboard.controller';
import { BarbeiroDashboardService } from './services/barbeiro-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [BarbeiroDashboardController],
  providers: [BarbeiroDashboardService],
})
export class BarbeiroDashboardModule {}
