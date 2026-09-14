import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { ClienteDashboardController } from './controller/cliente-dashboard.controller';
import { ClienteDashboardService } from './services/cliente-dashboard.service';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteDashboardController],
  providers: [ClienteDashboardService],
})
export class ClienteDashboardModule {}
