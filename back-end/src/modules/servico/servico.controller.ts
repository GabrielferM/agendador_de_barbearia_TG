import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiCrudErrors, ApiIdParam } from '../../common/swagger/decorators';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { ListarServicosDto } from './dto/listar-servicos.dto';
import { ListaServicosRespostaDto, ServicoRespostaDto } from './dto/servico-resposta.dto';
import { ServicoService } from './servico.service';

@ApiTags('Serviços')
@ExigirPermissoes('GERENCIAR_SERVICOS')
@Controller('servicos')
export class ServicoController {
  constructor(private readonly service: ServicoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um serviço' })
  @ApiCreatedResponse({ type: ServicoRespostaDto, description: 'Serviço criado com sucesso.' })
  @ApiCrudErrors()
  criar(@Body() dto: CriarServicoDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os serviços de forma paginada' })
  @ApiOkResponse({ type: ListaServicosRespostaDto, description: 'Lista de serviços retornada.' })
  @ApiCrudErrors()
  listar(@Query() query: ListarServicosDto) {
    return this.service.listar(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um serviço pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ type: ServicoRespostaDto, description: 'Serviço encontrado.' })
  @ApiCrudErrors()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um serviço pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ type: ServicoRespostaDto, description: 'Serviço atualizado com sucesso.' })
  @ApiCrudErrors()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarServicoDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um serviço pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ description: 'Serviço removido com sucesso.' })
  @ApiCrudErrors()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
