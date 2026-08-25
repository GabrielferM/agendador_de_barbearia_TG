import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { BarbeiroController } from './barbeiro.controller';
import { BarbeiroService } from './barbeiro.service';
import { ValidarFilialBarbeiroService } from './validations/validar-filial-barbeiro.service';
import { CriarBarbeiroService } from './service/criar-barbeiro.service';
import { ListarBarbeirosService } from './service/listar-barbeiros.service';
import { BuscarBarbeiroService } from './service/buscar-barbeiro.service';
import { EditarBarbeiroService } from './service/editar-barbeiro.service';
import { RemoverBarbeiroService } from './service/remover-barbeiro.service';
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [BarbeiroController],
  providers: [
    BarbeiroService,
    ValidarFilialBarbeiroService,
    CriarBarbeiroService,
    ListarBarbeirosService,
    BuscarBarbeiroService,
    EditarBarbeiroService,
    RemoverBarbeiroService,
  ],
  exports: [BarbeiroService],
})
export class BarbeiroModule {}
