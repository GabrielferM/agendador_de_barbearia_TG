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
import { ApiTags } from '@nestjs/swagger';
import { AtualizarPermissaoDto, CriarPermissaoDto, ListarPermissoesDto } from './dto/permissao.dto';
import { PermissaoService } from './permissao.service';
@ApiTags('Permissões')
@Controller('permissoes')
export class PermissaoController {
  constructor(private readonly service: PermissaoService) {}
  @Post() criar(@Body() dto: CriarPermissaoDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarPermissoesDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarPermissaoDto,
  ) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
