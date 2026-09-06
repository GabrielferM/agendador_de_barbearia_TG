import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { PermissaoController } from './permissao.controller';
import { PermissaoService } from './permissao.service';
import { BuscarPermissaoService } from './service/buscar-permissao.service';
import { CriarPermissaoService } from './service/criar-permissao.service';
import { EditarPermissaoService } from './service/editar-permissao.service';
import { ListarPermissoesService } from './service/listar-permissoes.service';
import { RemoverPermissaoService } from './service/remover-permissao.service';
@Module({
  imports: [PrismaModule],
  controllers: [PermissaoController],
  providers: [
    PermissaoService,
    CriarPermissaoService,
    ListarPermissoesService,
    BuscarPermissaoService,
    EditarPermissaoService,
    RemoverPermissaoService,
  ],
})
export class PermissaoModule {}
