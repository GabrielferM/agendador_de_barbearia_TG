import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ServicosDashboardController } from './controller/servicos-dashboard.controller';
import { ServicosDashboardService } from './services/servicos-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicosDashboardController],
  providers: [ServicosDashboardService],
})
export class ServicosDashboardModule {}
