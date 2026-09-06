import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CommonModule } from '../../common/common.module';
import { AdministradorController } from './administrador.controller';
import { AdministradorService } from './administrador.service';
import { BuscarAdministradorService } from './service/buscar-administrador.service';
import { CriarAdministradorService } from './service/criar-administrador.service';
import { EditarAdministradorService } from './service/editar-administrador.service';
import { ListarAdministradoresService } from './service/listar-administradores.service';
import { RemoverAdministradorService } from './service/remover-administrador.service';

@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [AdministradorController],
  providers: [
    AdministradorService,
    CriarAdministradorService,
    ListarAdministradoresService,
    BuscarAdministradorService,
    EditarAdministradorService,
    RemoverAdministradorService,
  ],
})
export class AdministradorModule {}
