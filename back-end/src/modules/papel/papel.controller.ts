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
import {
  AtualizarPapelDto,
  AtualizarPapelPermissaoDto,
  CriarPapelDto,
  ListarPapeisDto,
  VincularPermissaoDto,
} from './dto/papel.dto';
import { PapelService } from './papel.service';

@ApiTags('Papéis')
@Controller('papeis')
export class PapelController {
  constructor(private readonly service: PapelService) {}
  @Post() criar(@Body() dto: CriarPapelDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarPapeisDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarPapelDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
  @Get(':id/permissoes') listarPermissoes(@Param('id', ParseIntPipe) id: number) {
    return this.service.listarPermissoes(id);
  }
  @Post(':id/permissoes') vincular(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VincularPermissaoDto,
  ) {
    return this.service.vincular(id, dto.idPermissao);
  }
  @Patch(':id/permissoes/:idPermissao') atualizarVinculo(
    @Param('id', ParseIntPipe) id: number,
    @Param('idPermissao', ParseIntPipe) idPermissao: number,
    @Body() dto: AtualizarPapelPermissaoDto,
  ) {
    return this.service.atualizarVinculo(id, idPermissao, dto);
  }
  @Delete(':id/permissoes/:idPermissao') desvincular(
    @Param('id', ParseIntPipe) id: number,
    @Param('idPermissao', ParseIntPipe) idPermissao: number,
  ) {
    return this.service.desvincular(id, idPermissao);
  }
}
