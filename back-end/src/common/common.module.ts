import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ExclusaoCascataService } from './services/exclusao-cascata.service';

@Module({
  imports: [PrismaModule],
  providers: [ExclusaoCascataService],
  exports: [ExclusaoCascataService],
})
export class CommonModule {}
