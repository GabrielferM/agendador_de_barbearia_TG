import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ComissaoController } from './comissao.controller';
import { ComissaoService } from './comissao.service';
@Module({
  imports: [PrismaModule],
  controllers: [ComissaoController],
  providers: [ComissaoService],
})
export class ComissaoModule {}
