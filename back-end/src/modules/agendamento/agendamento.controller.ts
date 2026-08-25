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
  ListarAgendamentosDto,
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
