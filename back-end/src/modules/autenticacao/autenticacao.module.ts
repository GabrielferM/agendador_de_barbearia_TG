import { OperacaoContaInterceptor } from './operacao-conta.interceptor';
import { RecuperarSenhaService } from './service/recuperar-senha.service';
import { EmailContaService } from './service/email-conta.service';
import { LimiteRecuperacaoService } from './service/limite-recuperacao.service';
import { CadastrarClienteService } from './service/cadastrar-cliente.service';
import { CriarClienteService } from '../cliente/service/criar-cliente.service';
import { Module } from '@nestjs/common';
import { CommonModule } from '../../common/common.module';
import { PrismaModule } from '../../prisma/prisma.module';
import { AutenticacaoController } from './autenticacao.controller';
import { AutenticacaoService } from './autenticacao.service';
import { LoginService } from './service/login.service';
import { SessaoService } from './service/sessao.service';

@Module({
  imports: [CommonModule, PrismaModule],
  controllers: [AutenticacaoController],
  providers: [
    OperacaoContaInterceptor,
    AutenticacaoService,
    LoginService,
    SessaoService,
    CriarClienteService,
    RecuperarSenhaService,
    EmailContaService,
    LimiteRecuperacaoService,
    CadastrarClienteService,
  ],
  exports: [SessaoService],
})
export class AutenticacaoModule {}
