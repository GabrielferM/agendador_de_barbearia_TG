import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ServicoController } from './servico.controller';
import { ServicoRepository } from './servico.repository';
import { ServicoService } from './servico.service';
import { CriarServicoService } from './service/criar-servico/criar-servico.service';
import { ListarServicosService } from './service/listar-servicos/listar-servicos.service';

@Module({
  imports: [PrismaModule],
  controllers: [ServicoController],
  providers: [
    ServicoService,
    ServicoRepository,
    CriarServicoService,
    ListarServicosService,
  ],
  exports: [ServicoService, ServicoRepository],
})
export class ServicoModule {}
