import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { DashboardAdministradorService } from './dashboard-administrador.service';
import { DashboardAdministradorRespostaDto } from './dto/dashboard-administrador-resposta.dto';

@ApiTags('Dashboard administrativo')
@ExigirPermissoes('GERENCIAR_AGENDAMENTOS')
@Controller('dashboard/administrador')
export class DashboardAdministradorController {
  constructor(private readonly service: DashboardAdministradorService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: DashboardAdministradorRespostaDto })
  obter() {
    return this.service.obter();
  }
}
