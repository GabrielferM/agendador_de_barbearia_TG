import { Body, Controller, Get, Post } from '@nestjs/common';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { ServicoService } from './servico.service';

@Controller('servicos')
export class ServicoController {
  constructor(private readonly servicoService: ServicoService) {}

  @Post()
  async criar(@Body() dto: CriarServicoDto) {
    return this.servicoService.criar(dto);
  }

  @Get()
  async listar() {
    return this.servicoService.listar();
  }
}
