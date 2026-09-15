import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import { DashboardAdministradorRespostaDto } from '../dto/dashboard-resposta.dto';
import { DashboardService } from '../services/dashboard.service';
import { ApiErrosAutenticados } from '../../../../common/swagger/decorators';

@ApiTags('Dashboard administrativo')
@ApiErrosAutenticados()
@ExigirPermissoes('GERENCIAR_AGENDAMENTOS')
@Controller('dashboard/administrador')
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém a visão geral administrativa' })
  @ApiOkResponse({ type: DashboardAdministradorRespostaDto })
  obter() {
    return this.service.obter();
  }
}
