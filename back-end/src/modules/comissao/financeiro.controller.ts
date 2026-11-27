import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { UsuarioAutenticado } from '../../common/auth/auth.types';
import { ApiCrudErrors, ApiErrosAutenticados } from '../../common/swagger/decorators';
import { PaginacaoDto } from '../../common/dto/paginacao.dto';
import {
  ConfigurarPercentualDto,
  ConsultarExtratoDto,
  ExtratoFinanceiroDto,
  RepasseRespostaDto,
  TaxasBarbeirosDto,
} from './dto/financeiro.dto';
import { FinanceiroService } from './financeiro.service';
@ApiTags('Financeiro')
@ApiCrudErrors()
@ApiErrosAutenticados()
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly service: FinanceiroService) {}
  @Get('comissoes')
  @ExigirPermissoes('GERENCIAR_COMISSOES')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ExtratoFinanceiroDto })
  extrato(@Query() query: ConsultarExtratoDto) {
    return this.service.extrato(query);
  }
  @Get('minhas-comissoes')
  @ExigirPermissoes('GERENCIAR_PROPRIA_AGENDA')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ExtratoFinanceiroDto })
  minhas(@Query() query: ConsultarExtratoDto, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.extrato(query, usuario);
  }
  @Get('barbeiros')
  @ExigirPermissoes('GERENCIAR_COMISSOES')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: TaxasBarbeirosDto })
  taxas(@Query() query: PaginacaoDto) {
    return this.service.taxas(query);
  }
  @Patch('barbeiros/:id/percentual')
  @ExigirPermissoes('GERENCIAR_COMISSOES')
  @HttpCode(204)
  @ApiNoContentResponse()
  configurar(@Param('id', ParseIntPipe) id: number, @Body() dto: ConfigurarPercentualDto) {
    return this.service.configurar(id, dto);
  }
  @Post('comissoes/:id/repasse')
  @ExigirPermissoes('GERENCIAR_COMISSOES')
  @HttpCode(200)
  @ApiOkResponse({ type: RepasseRespostaDto })
  pagar(@Param('id', ParseIntPipe) id: number, @UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.pagar(id, usuario);
  }
}
