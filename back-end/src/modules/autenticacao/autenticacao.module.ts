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
  providers: [AutenticacaoService, LoginService, SessaoService],
  exports: [SessaoService],
})
export class AutenticacaoModule {}
