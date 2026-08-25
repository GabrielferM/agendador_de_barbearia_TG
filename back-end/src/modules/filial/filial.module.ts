import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { FilialController } from './filial.controller';
import { FilialService } from './filial.service';
import { NormalizarEnderecoFilialService } from './validations/normalizar-endereco-filial.service';
import { CriarFilialService } from './service/criar-filial.service';
import { ListarFiliaisService } from './service/listar-filiais.service';
import { BuscarFilialService } from './service/buscar-filial.service';
import { EditarFilialService } from './service/editar-filial.service';
import { RemoverFilialService } from './service/remover-filial.service';
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [FilialController],
  providers: [
    FilialService,
    NormalizarEnderecoFilialService,
    CriarFilialService,
    ListarFiliaisService,
    BuscarFilialService,
    EditarFilialService,
    RemoverFilialService,
  ],
})
export class FilialModule {}
