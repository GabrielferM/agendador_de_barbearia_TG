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
import { AdministradorService } from './administrador.service';
import {
  AtualizarAdministradorDto,
  CriarAdministradorDto,
  ListarAdministradoresDto,
} from './dto/administrador.dto';

@ApiTags('Administradores')
@Controller('administradores')
export class AdministradorController {
  constructor(private readonly service: AdministradorService) {}
  @Post() criar(@Body() dto: CriarAdministradorDto) {
    return this.service.criar(dto);
  }
  @Get() listar(@Query() query: ListarAdministradoresDto) {
    return this.service.listar(query);
  }
  @Get(':id') buscar(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscar(id);
  }
  @Patch(':id') atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarAdministradorDto,
  ) {
    return this.service.atualizar(id, dto);
  }
  @Delete(':id') remover(@Param('id', ParseIntPipe) id: number) {
    return this.service.remover(id);
  }
}
