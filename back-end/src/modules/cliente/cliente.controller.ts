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
import { AtualizarClienteDto, CriarClienteDto, ListarClientesDto } from './dto/cliente.dto';
import { ClienteService } from './cliente.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Clientes')
@Controller('clientes')
export class ClienteController {
  constructor(private readonly service: ClienteService) {}
  @Post() criar(@Body() dto: CriarClienteDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarClientesDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarClienteDto) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
