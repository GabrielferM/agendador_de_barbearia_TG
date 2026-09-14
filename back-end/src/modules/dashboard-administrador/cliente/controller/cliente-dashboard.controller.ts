import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import {
  ClientesDashboardRespostaDto,
  ConsultarClientesDashboardDto,
} from '../dto/cliente-dashboard.dto';
import { ClienteDashboardService } from '../services/cliente-dashboard.service';

@ApiTags('Dashboard administrativo - clientes')
@ExigirPermissoes('GERENCIAR_USUARIOS')
@Controller('dashboard/administrador/clientes')
export class ClienteDashboardController {
  constructor(private readonly service: ClienteDashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém indicadores e a lista de clientes' })
  @ApiOkResponse({ type: ClientesDashboardRespostaDto })
  obter(@Query() query: ConsultarClientesDashboardDto) {
    return this.service.obter(query);
  }
}
