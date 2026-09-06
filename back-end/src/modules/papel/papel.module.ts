import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PapelController } from './papel.controller';
import { PapelService } from './papel.service';
import { BuscarPapelService } from './service/buscar-papel.service';
import { CriarPapelService } from './service/criar-papel.service';
import { DesvincularPermissaoPapelService } from './service/desvincular-permissao-papel.service';
import { EditarPapelService } from './service/editar-papel.service';
import { EditarVinculoPapelPermissaoService } from './service/editar-vinculo-papel-permissao.service';
import { ListarPapeisService } from './service/listar-papeis.service';
import { ListarPermissoesPapelService } from './service/listar-permissoes-papel.service';
import { RemoverPapelService } from './service/remover-papel.service';
import { VincularPermissaoPapelService } from './service/vincular-permissao-papel.service';

@Module({
  imports: [PrismaModule],
  controllers: [PapelController],
  providers: [
    PapelService,
    CriarPapelService,
    ListarPapeisService,
    BuscarPapelService,
    EditarPapelService,
    RemoverPapelService,
    ListarPermissoesPapelService,
    VincularPermissaoPapelService,
    EditarVinculoPapelPermissaoService,
    DesvincularPermissaoPapelService,
  ],
})
export class PapelModule {}
