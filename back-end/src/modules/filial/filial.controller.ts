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
import { AtualizarFilialDto, CriarFilialDto, ListarFiliaisDto } from './dto/filial.dto';
import { FilialService } from './filial.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilialRespostaDto, ListaFiliaisRespostaDto } from './dto/filial-resposta.dto';
import { ExigirPermissoes } from '../../common/auth/exigir-permissoes.decorator';
import { ApiCrudErrors, ApiErrosAutenticados } from '../../common/swagger/decorators';
@ApiTags('Filiais')
@ApiErrosAutenticados()
@ApiCrudErrors()
@ExigirPermissoes('GERENCIAR_FILIAIS')
@Controller('filiais')
export class FilialController {
  constructor(private readonly service: FilialService) {}
  @Post()
  @ApiCreatedResponse({ type: FilialRespostaDto })
  criar(@Body() dto: CriarFilialDto) {
    return this.service.criar(dto);
  }
  @Get()
  @ApiOkResponse({ type: ListaFiliaisRespostaDto })
  listar(@Query() query: ListarFiliaisDto) {
    return this.service.listar(query);
  }
  @Get(':id')
  @ApiOkResponse({ type: FilialRespostaDto })
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id')
  @ApiOkResponse({ type: FilialRespostaDto })
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarFilialDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
