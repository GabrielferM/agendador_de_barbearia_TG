import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissaoController } from './permissao.controller';
import { PermissaoService } from './permissao.service';
@Module({
  imports: [PrismaModule],
  controllers: [PermissaoController],
  providers: [PermissaoService],
})
export class PermissaoModule {}
