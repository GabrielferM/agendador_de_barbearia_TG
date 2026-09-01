import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PapelController } from './papel.controller';
import { PapelService } from './papel.service';
@Module({ imports: [PrismaModule], controllers: [PapelController], providers: [PapelService] })
export class PapelModule {}
