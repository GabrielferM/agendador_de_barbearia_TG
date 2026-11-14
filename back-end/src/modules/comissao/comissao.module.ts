import { ConfigurarPercentualService } from './service/configurar-percentual.service';
import { RegistrarRepasseService } from './service/registrar-repasse.service';
import { ConsultarFinanceiroService } from './service/consultar-financeiro.service';
import { FinanceiroService } from './financeiro.service';
import { FinanceiroController } from './financeiro.controller';
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
  controllers: [ComissaoController, FinanceiroController],
  providers: [
    FinanceiroService,
    ConsultarFinanceiroService,
    RegistrarRepasseService,
    ConfigurarPercentualService,
    ComissaoService,
    CriarComissaoService,
    ListarComissoesService,
    BuscarComissaoService,
    EditarComissaoService,
  ],
})
export class ComissaoModule {}
