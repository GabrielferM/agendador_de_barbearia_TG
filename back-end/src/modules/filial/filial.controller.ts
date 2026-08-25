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
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Filiais')
@Controller('filiais')
export class FilialController {
  constructor(private readonly service: FilialService) {}
  @Post() criar(@Body() dto: CriarFilialDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarFiliaisDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarFilialDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
