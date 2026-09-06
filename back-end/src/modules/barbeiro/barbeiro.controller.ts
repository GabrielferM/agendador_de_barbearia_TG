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
import { BarbeiroService } from './barbeiro.service';
import { BarbeiroRespostaDto, ListaBarbeirosRespostaDto } from './dto/barbeiro-resposta.dto';
import { AtualizarBarbeiroDto, CriarBarbeiroDto, ListarBarbeirosDto } from './dto/barbeiro.dto';

@ApiTags('Barbeiros')
@ExigirPermissoes('GERENCIAR_USUARIOS')
@Controller('barbeiros')
export class BarbeiroController {
  constructor(private readonly service: BarbeiroService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um barbeiro' })
  @ApiCreatedResponse({ type: BarbeiroRespostaDto, description: 'Barbeiro criado com sucesso.' })
  @ApiCrudErrors()
  criar(@Body() dto: CriarBarbeiroDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os barbeiros de forma paginada' })
  @ApiOkResponse({ type: ListaBarbeirosRespostaDto, description: 'Lista de barbeiros retornada.' })
  @ApiCrudErrors()
  listar(@Query() query: ListarBarbeirosDto) {
    return this.service.listar(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um barbeiro pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ type: BarbeiroRespostaDto, description: 'Barbeiro encontrado.' })
  @ApiCrudErrors()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um barbeiro pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ type: BarbeiroRespostaDto, description: 'Barbeiro atualizado com sucesso.' })
  @ApiCrudErrors()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarBarbeiroDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um barbeiro pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ description: 'Barbeiro removido com sucesso.' })
  @ApiCrudErrors()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
