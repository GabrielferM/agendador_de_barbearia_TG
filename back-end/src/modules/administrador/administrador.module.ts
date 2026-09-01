import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AdministradorController } from './administrador.controller';
import { AdministradorService } from './administrador.service';

@Module({
  imports: [PrismaModule],
  controllers: [AdministradorController],
  providers: [AdministradorService],
})
export class AdministradorModule {}
