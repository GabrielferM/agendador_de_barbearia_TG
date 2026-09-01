import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { ServicoModule } from './modules/servico/servico.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { BarbeiroModule } from './modules/barbeiro/barbeiro.module';
import { FilialModule } from './modules/filial/filial.module';
import { AgendamentoModule } from './modules/agendamento/agendamento.module';
import { AdministradorModule } from './modules/administrador/administrador.module';
import { PapelModule } from './modules/papel/papel.module';
import { PermissaoModule } from './modules/permissao/permissao.module';
import { ComissaoModule } from './modules/comissao/comissao.module';
import { validateEnvironment } from './config/environment';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    PrismaModule,
    HealthModule,
    ServicoModule,
    AdministradorModule,
    ClienteModule,
    BarbeiroModule,
    FilialModule,
    AgendamentoModule,
    PapelModule,
    PermissaoModule,
    ComissaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
