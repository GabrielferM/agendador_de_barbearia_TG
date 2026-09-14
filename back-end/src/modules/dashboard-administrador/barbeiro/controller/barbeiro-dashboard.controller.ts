import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import {
  BarbeirosDashboardRespostaDto,
  ConsultarBarbeirosDashboardDto,
} from '../dto/barbeiro-dashboard.dto';
import { BarbeiroDashboardService } from '../services/barbeiro-dashboard.service';

@ApiTags('Dashboard administrativo - barbeiros')
@ExigirPermissoes('GERENCIAR_USUARIOS')
@Controller('dashboard/administrador/barbeiros')
export class BarbeiroDashboardController {
  constructor(private readonly service: BarbeiroDashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém indicadores e desempenho da equipe' })
  @ApiOkResponse({ type: BarbeirosDashboardRespostaDto })
  obter(@Query() query: ConsultarBarbeirosDashboardDto) {
    return this.service.obter(query);
  }
}
