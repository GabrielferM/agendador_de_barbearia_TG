import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import {
  ConsultarBarbeiroDto,
  ConsultarHistoricoBarbeiroDto,
  ServicosBarbeiroRespostaDto,
  ClientesBarbeiroRespostaDto,
  HistoricoBarbeiroRespostaDto,
} from './dto/consultas-barbeiro.dto';
import { DashboardBarbeiroService } from './dashboard-barbeiro.service';
import { DashboardBarbeiroRespostaDto } from './dto/dashboard-barbeiro-resposta.dto';
import { ApiErrosAutenticados } from '../../common/swagger/decorators';

@ApiTags('Dashboard do barbeiro')
@ApiErrosAutenticados()
@ExigirPermissoes('GERENCIAR_PROPRIA_AGENDA')
@Controller('dashboard/barbeiro')
export class DashboardBarbeiroController {
  constructor(private readonly service: DashboardBarbeiroService) {}

  @Get('servicos')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ServicosBarbeiroRespostaDto })
  servicos(@Query() query: ConsultarBarbeiroDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.servicos(query, usuario);
  }
  @Get('clientes')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ClientesBarbeiroRespostaDto })
  clientes(@Query() query: ConsultarBarbeiroDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.clientes(query, usuario);
  }
  @Get('historico')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: HistoricoBarbeiroRespostaDto })
  historico(
    @Query() query: ConsultarHistoricoBarbeiroDto,
    @UsuarioAtual() usuario: UsuarioAutenticado,
  ) {
    return this.service.historico(query, usuario);
  }
  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: DashboardBarbeiroRespostaDto })
  obter(@UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.obter(usuario);
  }
}
