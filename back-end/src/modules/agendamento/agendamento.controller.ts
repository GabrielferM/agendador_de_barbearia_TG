import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { AgendamentoService } from './agendamento.service';
import {
  AtualizarAgendamentoDto,
  CriarAgendamentoDto,
  CriarHistoricoStatusDto,
  ListarAgendamentosDto,
  ListarHistoricoStatusDto,
} from './dto/agendamento.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Agendamentos')
@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly service: AgendamentoService) {}
  @Post() criar(@Body() dto: CriarAgendamentoDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarAgendamentosDto) {
    return this.service.listar(query);
  }
  @Get(':id/historico-status')
  listarHistorico(@Param('id', ParseIntPipe) id: number, @Query() query: ListarHistoricoStatusDto) {
    return this.service.listarHistorico(id, query);
  }
  @Post(':id/historico-status')
  criarHistorico(@Param('id', ParseIntPipe) id: number, @Body() dto: CriarHistoricoStatusDto) {
    return this.service.criarHistorico(id, dto);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAgendamentoDto,
  ) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
