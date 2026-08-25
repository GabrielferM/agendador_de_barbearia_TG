import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { UsuarioController } from './usuario.controller';
import { UsuarioService } from './usuario.service';
import { CriarUsuarioService } from './service/criar-usuario.service';
import { ListarUsuariosService } from './service/listar-usuarios.service';
import { BuscarUsuarioService } from './service/buscar-usuario.service';
import { EditarUsuarioService } from './service/editar-usuario.service';
import { RemoverUsuarioService } from './service/remover-usuario.service';

@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [UsuarioController],
  providers: [
    UsuarioService,
    CriarUsuarioService,
    ListarUsuariosService,
    BuscarUsuarioService,
    EditarUsuarioService,
    RemoverUsuarioService,
  ],
})
export class UsuarioModule {}
