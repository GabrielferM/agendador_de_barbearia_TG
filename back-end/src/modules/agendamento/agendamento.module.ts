import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { AgendamentoController } from './agendamento.controller';
import { AgendamentoService } from './agendamento.service';
import { BuscarServicosAgendamentoService } from './validations/buscar-servicos-agendamento.service';
import { CalcularFimAgendamentoService } from './validations/calcular-fim-agendamento.service';
import { CalcularValorTotalAgendamentoService } from './validations/calcular-valor-total-agendamento.service';
import { ValidarDataHoraAgendamentoService } from './validations/validar-data-hora-agendamento.service';
import { ValidarVinculosAgendamentoService } from './validations/validar-vinculos-agendamento.service';
import { VerificarConflitoAgendamentoService } from './validations/verificar-conflito-agendamento.service';
import { CriarAgendamentoService } from './service/criar-agendamento.service';
import { ListarAgendamentosService } from './service/listar-agendamentos.service';
import { BuscarAgendamentoService } from './service/buscar-agendamento.service';
import { EditarAgendamentoService } from './service/editar-agendamento.service';
import { RemoverAgendamentoService } from './service/remover-agendamento.service';
@Module({
  imports: [PrismaModule],
  controllers: [AgendamentoController],
  providers: [
    AgendamentoService,
    BuscarServicosAgendamentoService,
    CalcularFimAgendamentoService,
    CalcularValorTotalAgendamentoService,
    ValidarDataHoraAgendamentoService,
    ValidarVinculosAgendamentoService,
    VerificarConflitoAgendamentoService,
    CriarAgendamentoService,
    ListarAgendamentosService,
    BuscarAgendamentoService,
    EditarAgendamentoService,
    RemoverAgendamentoService,
  ],
})
export class AgendamentoModule {}
