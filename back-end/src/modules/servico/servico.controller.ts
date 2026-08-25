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
import { ListaServicosRespostaDto, ServicoRespostaDto } from '../../common/swagger/respostas.dto';
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { ListarServicosDto } from './dto/listar-servicos.dto';
import { ServicoService } from './servico.service';

@ApiTags('Serviços')
@Controller('servicos')
export class ServicoController {
  constructor(private readonly service: ServicoService) {}
  @Post()
  @ApiOperation({ summary: 'Cria um serviço' })
  @ApiCreatedResponse({ type: ServicoRespostaDto })
  @ApiCrudErrors()
  criar(@Body() dto: CriarServicoDto) {
    return this.service.criar(dto);
  }
  @Get()
  @ApiOperation({ summary: 'Lista serviços paginados' })
  @ApiOkResponse({ type: ListaServicosRespostaDto })
  @ApiCrudErrors()
  listar(@Query() query: ListarServicosDto) {
    return this.service.listar(query);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Busca um serviço' })
  @ApiIdParam()
  @ApiOkResponse({ type: ServicoRespostaDto })
  @ApiCrudErrors()
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza um serviço' })
  @ApiIdParam()
  @ApiOkResponse({ type: ServicoRespostaDto })
  @ApiCrudErrors()
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarServicoDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove um serviço e agendamentos vinculados' })
  @ApiIdParam()
  @ApiNoContentResponse()
  @ApiCrudErrors()
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
