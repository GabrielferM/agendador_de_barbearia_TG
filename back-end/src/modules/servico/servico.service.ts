import { Injectable } from '@nestjs/common';
import { CriarServicoService } from './service/criar-servico.service';
import { ListarServicosService } from './service/listar-servicos.service';
import { BuscarServicoService } from './service/buscar-servico.service';
import { EditarServicoService } from './service/editar-servico.service';
import { RemoverServicoService } from './service/remover-servico.service';
import { AtualizarServicoDto } from './dto/atualizar-servico.dto';
import { CriarServicoDto } from './dto/criar-servico.dto';
import { ListarServicosDto } from './dto/listar-servicos.dto';

@Injectable()
export class ServicoService {
  constructor(
    private readonly criarService: CriarServicoService,
    private readonly listarService: ListarServicosService,
    private readonly buscarService: BuscarServicoService,
    private readonly editarService: EditarServicoService,
    private readonly removerService: RemoverServicoService,
  ) {}

  async criar(dto: CriarServicoDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarServicosDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarServicoDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
