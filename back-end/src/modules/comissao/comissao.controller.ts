import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ComissaoService } from './comissao.service';
import { AtualizarComissaoDto, CriarComissaoDto, ListarComissoesDto } from './dto/comissao.dto';
@ApiTags('Comissões')
@Controller('comissoes')
export class ComissaoController {
  constructor(private readonly service: ComissaoService) {}
  @Post() criar(@Body() dto: CriarComissaoDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarComissoesDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarComissaoDto,
  ) {
    return this.service.atualizar(id, dto);
  }
}
