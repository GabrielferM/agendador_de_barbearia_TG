import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { EnderecoController } from './endereco.controller';
import { EnderecoService } from './endereco.service';
import { CriarEnderecoService } from './service/criar-endereco.service';
import { ListarEnderecosService } from './service/listar-enderecos.service';
import { BuscarEnderecoService } from './service/buscar-endereco.service';
import { EditarEnderecoService } from './service/editar-endereco.service';
import { RemoverEnderecoService } from './service/remover-endereco.service';
@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [EnderecoController],
  providers: [
    EnderecoService,
    CriarEnderecoService,
    ListarEnderecosService,
    BuscarEnderecoService,
    EditarEnderecoService,
    RemoverEnderecoService,
  ],
})
export class EnderecoModule {}
