import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServicoController } from './servico.controller';
import { ServicoService } from './servico.service';
import { CriarServicoService } from './service/criar-servico.service';
import { ListarServicosService } from './service/listar-servicos.service';
import { BuscarServicoService } from './service/buscar-servico.service';
import { EditarServicoService } from './service/editar-servico.service';
import { RemoverServicoService } from './service/remover-servico.service';
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [ServicoController],
  providers: [
    ServicoService,
    CriarServicoService,
    ListarServicosService,
    BuscarServicoService,
    EditarServicoService,
    RemoverServicoService,
  ],
})
export class ServicoModule {}
