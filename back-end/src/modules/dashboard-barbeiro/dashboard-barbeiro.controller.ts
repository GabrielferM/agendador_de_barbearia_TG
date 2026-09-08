import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';
import { DashboardBarbeiroRespostaDto } from './dto/dashboard-barbeiro-resposta.dto';

@ApiTags('Dashboard do barbeiro')
@ExigirPermissoes('GERENCIAR_PROPRIA_AGENDA')
@Controller('dashboard/barbeiro')
export class DashboardBarbeiroController {
  constructor(private readonly service: DashboardBarbeiroService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: DashboardBarbeiroRespostaDto })
  obter(@UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.obter(usuario);
  }
}
