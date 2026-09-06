import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Publico } from '../../common/auth/publico.decorator';
import { PaginacaoDto } from '../../common/dto/paginacao.dto';
import { CatalogoPublicoService } from './catalogo-publico.service';
import {
  ListaBarbeirosPublicosDto,
  ListaFiliaisPublicasDto,
  ListaServicosPublicosDto,
} from './dto/catalogo-publico.dto';

@ApiTags('Catálogo público')
@Publico()
@Controller('publico')
export class CatalogoPublicoController {
  constructor(private readonly service: CatalogoPublicoService) {}
  @Get('servicos')
  @ApiOperation({ summary: 'Lista serviços ativos sem dados internos' })
  @ApiOkResponse({ type: ListaServicosPublicosDto })
  servicos(@Query() query: PaginacaoDto) {
    return this.service.servicos(query);
  }
  @Get('barbeiros')
  @ApiOperation({ summary: 'Lista barbeiros ativos sem dados pessoais' })
  @ApiOkResponse({ type: ListaBarbeirosPublicosDto })
  barbeiros(@Query() query: PaginacaoDto) {
    return this.service.barbeiros(query);
  }
  @Get('filiais')
  @ApiOperation({ summary: 'Lista filiais ativas sem dados administrativos' })
  @ApiOkResponse({ type: ListaFiliaisPublicasDto })
  filiais(@Query() query: PaginacaoDto) {
    return this.service.filiais(query);
  }
}
