import { Controller, Get, Header, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../../../common/auth/exigir-permissoes.decorator';
import {
  ConsultarFinanceiroDashboardDto,
  FinanceiroDashboardRespostaDto,
} from '../dto/financeiro-dashboard.dto';
import { FinanceiroDashboardService } from '../services/financeiro-dashboard.service';

@ApiTags('Dashboard administrativo - financeiro')
@ExigirPermissoes('GERENCIAR_COMISSOES')
@Controller('dashboard/administrador/financeiro')
export class FinanceiroDashboardController {
  constructor(private readonly service: FinanceiroDashboardService) {}

  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOperation({ summary: 'Obtém receitas e comissões por período' })
  @ApiOkResponse({ type: FinanceiroDashboardRespostaDto })
  obter(@Query() query: ConsultarFinanceiroDashboardDto) {
    return this.service.obter(query);
  }
}
