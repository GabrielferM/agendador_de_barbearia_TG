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
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { ListarServicosDto } from './dto/listar-servicos.dto';
import { ServicoService } from './servico.service';

@ApiTags('Serviços')
@Controller('servicos')
export class ServicoController {
  constructor(private readonly service: ServicoService) {}
  @Post()
  criar(@Body() dto: CriarServicoDto) {
    return this.service.criar(dto);
  }
  @Get()
  listar(@Query() query: ListarServicosDto) {
    return this.service.listar(query);
  }
  @Get(':id')
  buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarServicoDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
