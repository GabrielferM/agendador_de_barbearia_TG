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
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
@ApiTags('Agendamentos')
@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly service: AgendamentoService) {}
  @Post() criar(@Body() dto: CriarAgendamentoDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.criar(dto, usuario);
  }
  @Get() listar(
    @Query() query: ListarAgendamentosDto,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.listar(query, usuario);
  }
  @Get(':id/historico-status')
  listarHistorico(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: ListarHistoricoStatusDto,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.listarHistorico(id, query, usuario);
  }
  @Post(':id/historico-status')
  criarHistorico(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CriarHistoricoStatusDto,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.criarHistorico(id, dto, usuario);
  }
  @Get(':id') buscar(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.buscar(id, usuario);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAgendamentoDto,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.atualizar(id, dto, usuario);
  }
  @Delete(':id') remover(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.remover(id, usuario);
  }
}
