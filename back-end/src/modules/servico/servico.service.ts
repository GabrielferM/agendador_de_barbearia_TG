import { Injectable } from '@nestjs/common';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { CriarServicoService } from './service/criar-servico/criar-servico.service';
import { ListarServicosService } from './service/listar-servicos/listar-servicos.service';

@Injectable()
export class ServicoService {
  constructor(
    private readonly criarServicoService: CriarServicoService,
    private readonly listarServicosService: ListarServicosService,
  ) {}

  async criar(dto: CriarServicoDto) {
    return this.criarServicoService.execute(dto);
  }

  async listar() {
    return this.listarServicosService.execute();
  }
}
