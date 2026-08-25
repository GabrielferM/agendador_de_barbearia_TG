import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCrudErrors, ApiIdParam } from '../../common/swagger/decorators';
import { ListaUsuariosRespostaDto, UsuarioRespostaDto } from '../../common/swagger/respostas.dto';
import { AtualizarUsuarioDto, CriarUsuarioDto, ListarUsuariosDto } from './dto/usuario.dto';
import { UsuarioService } from './usuario.service';
@ApiTags('Usuários')
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly service: UsuarioService) {}
  @Post()
  @ApiOperation({ summary: 'Cria um usuário administrador' })
  @ApiCreatedResponse({ type: UsuarioRespostaDto })
  @ApiCrudErrors()
  criar(@Body() dto: CriarUsuarioDto) {
    return this.service.criar(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Lista usuários administradores' })
  @ApiOkResponse({ type: ListaUsuariosRespostaDto })
  @ApiCrudErrors()
  listar(@Query() query: ListarUsuariosDto) {
    return this.service.listar(query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Busca um usuário administrador' })
  @ApiIdParam()
  @ApiOkResponse({ type: UsuarioRespostaDto })
  @ApiCrudErrors()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um usuário administrador' })
  @ApiIdParam()
  @ApiOkResponse({ type: UsuarioRespostaDto })
  @ApiCrudErrors()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarUsuarioDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um usuário administrador' })
  @ApiIdParam()
  @ApiNoContentResponse()
  @ApiCrudErrors()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
