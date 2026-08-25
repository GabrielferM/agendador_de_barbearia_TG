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
import { AtualizarEnderecoDto, CriarEnderecoDto, ListarEnderecosDto } from './dto/endereco.dto';
import { EnderecoService } from './endereco.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Endereços')
@Controller('enderecos')
export class EnderecoController {
  constructor(private readonly service: EnderecoService) {}
  @Post() criar(@Body() dto: CriarEnderecoDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarEnderecosDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarEnderecoDto,
  ) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
