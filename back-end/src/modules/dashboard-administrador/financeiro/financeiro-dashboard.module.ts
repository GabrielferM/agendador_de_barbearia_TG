import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { FinanceiroDashboardController } from './controller/financeiro-dashboard.controller';
import { FinanceiroDashboardService } from './services/financeiro-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [FinanceiroDashboardController],
  providers: [FinanceiroDashboardService],
})
export class FinanceiroDashboardModule {}
