import {
  AgendamentoBarbeiroRespostaDto,
  ListaAgendamentosBarbeiroRespostaDto,
} from './dto/agendamento-barbeiro-resposta.dto';
import {
  AgendamentoRespostaDto,
  ListaAgendamentosRespostaDto,
} from './dto/agendamento-resposta.dto';
import { Publico } from '../../common/auth/publico.decorator';
import {
  HorariosDisponiveisDto,
  HorariosDisponiveisRespostaDto,
} from './dto/horarios-disponiveis.dto';
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
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiExtraModels,
  getSchemaPath,
} from '@nestjs/swagger';
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { ApiCrudErrors, ApiErrosAutenticados } from '../../common/swagger/decorators';
@ApiTags('Agendamentos')
@ApiExtraModels(
  AgendamentoRespostaDto,
  ListaAgendamentosRespostaDto,
  AgendamentoBarbeiroRespostaDto,
  ListaAgendamentosBarbeiroRespostaDto,
)
@ApiErrosAutenticados()
@ApiCrudErrors()
@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly service: AgendamentoService) {}
  @Post()
  @ApiCreatedResponse({ type: AgendamentoRespostaDto })
  criar(@Body() dto: CriarAgendamentoDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.criar(dto, usuario);
  }
  @Get()
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(ListaAgendamentosRespostaDto) },
        { $ref: getSchemaPath(ListaAgendamentosBarbeiroRespostaDto) },
      ],
    },
  })
  listar(@Query() query: ListarAgendamentosDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.listar(query, usuario);
  }
  @Publico()
  @Get('horarios-disponiveis')
  @ApiOperation({ summary: 'Consulta pública de horários livres', security: [] })
  @ApiOkResponse({ type: HorariosDisponiveisRespostaDto })
  horarios(@Query() query: HorariosDisponiveisDto) {
    return this.service.horarios(query);
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
  @Get(':id')
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AgendamentoRespostaDto) },
        { $ref: getSchemaPath(AgendamentoBarbeiroRespostaDto) },
      ],
    },
  })
  buscar(@Param('id', ParseIntPipe) id: number, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.buscar(id, usuario);
  }
  @Patch(':id')
  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(AgendamentoRespostaDto) },
        { $ref: getSchemaPath(AgendamentoBarbeiroRespostaDto) },
      ],
    },
  })
  atualizar(
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
