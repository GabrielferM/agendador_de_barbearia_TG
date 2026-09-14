import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import {
  AgendaDashboardRespostaDto,
  ConsultarAgendaDashboardDto,
} from '../dto/agendamento-dashboard.dto';
import { AgendamentoDashboardService } from '../services/agendamento-dashboard.service';

@ApiTags('Dashboard administrativo - agendamentos')
@ExigirPermissoes('GERENCIAR_AGENDAMENTOS')
@Controller('dashboard/administrador/agendamentos')
export class AgendamentoDashboardController {
  constructor(private readonly service: AgendamentoDashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém a agenda administrativa por período' })
  @ApiOkResponse({ type: AgendaDashboardRespostaDto })
  obter(@Query() query: ConsultarAgendaDashboardDto) {
    return this.service.obter(query);
  }
}
