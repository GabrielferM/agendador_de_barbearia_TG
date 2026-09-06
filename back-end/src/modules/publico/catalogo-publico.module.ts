import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CatalogoPublicoController } from './catalogo-publico.controller';
import { CatalogoPublicoService } from './catalogo-publico.service';

@Module({
  imports: [PrismaModule],
  controllers: [CatalogoPublicoController],
  providers: [CatalogoPublicoService],
})
export class CatalogoPublicoModule {}
