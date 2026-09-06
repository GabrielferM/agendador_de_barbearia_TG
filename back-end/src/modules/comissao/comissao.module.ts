import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ComissaoController } from './comissao.controller';
import { ComissaoService } from './comissao.service';
import { BuscarComissaoService } from './service/buscar-comissao.service';
import { CriarComissaoService } from './service/criar-comissao.service';
import { EditarComissaoService } from './service/editar-comissao.service';
import { ListarComissoesService } from './service/listar-comissoes.service';
@Module({
  imports: [PrismaModule],
  controllers: [ComissaoController],
  providers: [
    ComissaoService,
    CriarComissaoService,
    ListarComissoesService,
    BuscarComissaoService,
    EditarComissaoService,
  ],
})
export class ComissaoModule {}
