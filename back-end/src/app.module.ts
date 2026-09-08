import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
import { CommonModule } from './common/common.module';
import { AutenticacaoModule } from './modules/autenticacao/autenticacao.module';
import { AutenticacaoGuard } from './common/auth/autenticacao.guard';
import { CsrfGuard } from './common/auth/csrf.guard';
import { PermissaoGuard } from './common/auth/permissao.guard';
import { CatalogoPublicoModule } from './modules/publico/catalogo-publico.module';
import { DashboardAdministradorModule } from './modules/dashboard-administrador/dashboard-administrador.module';
import { DashboardBarbeiroModule } from './modules/dashboard-barbeiro/dashboard-barbeiro.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnvironment }),
    ThrottlerModule.forRoot([
      { name: 'global', ttl: 60_000, limit: 120 },
      { name: 'login', ttl: 60_000, limit: 10 },
    ]),
    CommonModule,
    PrismaModule,
    AutenticacaoModule,
    CatalogoPublicoModule,
    DashboardAdministradorModule,
    DashboardBarbeiroModule,
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
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AutenticacaoGuard },
    { provide: APP_GUARD, useClass: CsrfGuard },
    { provide: APP_GUARD, useClass: PermissaoGuard },
  ],
})
export class AppModule {}
