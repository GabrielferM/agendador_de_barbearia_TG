import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { ClienteController } from './cliente.controller';
import { ClienteService } from './cliente.service';
import { CriarClienteService } from './service/criar-cliente.service';
import { ListarClientesService } from './service/listar-clientes.service';
import { BuscarClienteService } from './service/buscar-cliente.service';
import { EditarClienteService } from './service/editar-cliente.service';
import { RemoverClienteService } from './service/remover-cliente.service';
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [ClienteController],
  providers: [
    ClienteService,
    CriarClienteService,
    ListarClientesService,
    BuscarClienteService,
    EditarClienteService,
    RemoverClienteService,
  ],
})
export class ClienteModule {}
