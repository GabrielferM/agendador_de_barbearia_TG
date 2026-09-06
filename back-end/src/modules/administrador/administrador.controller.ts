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
import {
  AtualizarAdministradorDto,
  CriarAdministradorDto,
  ListarAdministradoresDto,
} from './dto/administrador.dto';
import { AdministradorService } from './administrador.service';

@ApiTags('Administradores')
@ExigirPermissoes('GERENCIAR_USUARIOS')
@Controller('administradores')
export class AdministradorController {
  constructor(private readonly service: AdministradorService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um administrador' })
  @ApiCreatedResponse({ description: 'Administrador criado com sucesso.' })
  @ApiCrudErrors()
  criar(@Body() dto: CriarAdministradorDto) {
    return this.service.criar(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista os administradores de forma paginada' })
  @ApiOkResponse({ description: 'Lista de administradores retornada com sucesso.' })
  @ApiCrudErrors()
  listar(@Query() query: ListarAdministradoresDto) {
    return this.service.listar(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca um administrador pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ description: 'Administrador encontrado com sucesso.' })
  @ApiCrudErrors()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um administrador pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ description: 'Administrador atualizado com sucesso.' })
  @ApiCrudErrors()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarAdministradorDto) {
    return this.service.atualizar(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove um administrador pelo identificador' })
  @ApiIdParam()
  @ApiOkResponse({ description: 'Administrador removido com sucesso.' })
  @ApiCrudErrors()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
