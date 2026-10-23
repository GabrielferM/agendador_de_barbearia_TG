import { ListarItensElegiveisComissaoDto } from './dto/comissao.dto';
import {
  ComissaoRespostaDto,
  ListaComissoesRespostaDto,
  ItensElegiveisComissaoRespostaDto,
} from './dto/comissao-resposta.dto';
import {
  Body,
  Controller,
  Header,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOkResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { ApiCrudErrors, ApiErrosAutenticados } from '../../common/swagger/decorators';
import { ComissaoService } from './comissao.service';
import { AtualizarComissaoDto, CriarComissaoDto, ListarComissoesDto } from './dto/comissao.dto';
@ApiTags('Comissões')
@ApiErrosAutenticados()
@ApiCrudErrors()
@ExigirPermissoes('GERENCIAR_COMISSOES')
@Controller('comissoes')
export class ComissaoController {
  constructor(private readonly service: ComissaoService) {}
  @Post()
  @ApiCreatedResponse({ type: ComissaoRespostaDto })
  criar(@Body() dto: CriarComissaoDto) {
    return this.service.criar(dto);
  }
  @Get()
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ListaComissoesRespostaDto })
  listar(@Query() query: ListarComissoesDto) {
    return this.service.listar(query);
  }
  @Get('itens-elegiveis')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ItensElegiveisComissaoRespostaDto })
  itensElegiveis(@Query() query: ListarItensElegiveisComissaoDto) {
    return this.service.itensElegiveis(query);
  }
  @Get(':id')
  @Header('Cache-Control', 'no-store')
  @ApiOkResponse({ type: ComissaoRespostaDto })
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id')
  @ApiOkResponse({ type: ComissaoRespostaDto })
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarComissaoDto) {
    return this.service.atualizar(id, dto);
  }
}
