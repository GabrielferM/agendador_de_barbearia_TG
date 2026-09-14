import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import {
  ConsultarServicosDashboardDto,
  ServicosDashboardRespostaDto,
} from '../dto/servicos-dashboard.dto';
import { ServicosDashboardService } from '../services/servicos-dashboard.service';

@ApiTags('Dashboard administrativo - serviços')
@ExigirPermissoes('GERENCIAR_SERVICOS')
@Controller('dashboard/administrador/servicos')
export class ServicosDashboardController {
  constructor(private readonly service: ServicosDashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém indicadores e desempenho dos serviços' })
  @ApiOkResponse({ type: ServicosDashboardRespostaDto })
  obter(@Query() query: ConsultarServicosDashboardDto) {
    return this.service.obter(query);
  }
}
