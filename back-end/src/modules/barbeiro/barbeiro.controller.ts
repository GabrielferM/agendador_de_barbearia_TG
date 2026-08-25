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
import { BarbeiroService } from './barbeiro.service';
import { AtualizarBarbeiroDto, CriarBarbeiroDto, ListarBarbeirosDto } from './dto/barbeiro.dto';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Barbeiros')
@Controller('barbeiros')
export class BarbeiroController {
  constructor(private readonly service: BarbeiroService) {}
  @Post() criar(@Body() dto: CriarBarbeiroDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarBarbeirosDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarBarbeiroDto,
  ) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
