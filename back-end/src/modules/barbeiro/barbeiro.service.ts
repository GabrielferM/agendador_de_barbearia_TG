import { Injectable } from '@nestjs/common';
import { CriarBarbeiroService } from './service/criar-barbeiro.service';
import { ListarBarbeirosService } from './service/listar-barbeiros.service';
import { BuscarBarbeiroService } from './service/buscar-barbeiro.service';
import { EditarBarbeiroService } from './service/editar-barbeiro.service';
import { RemoverBarbeiroService } from './service/remover-barbeiro.service';
import { CriarBarbeiroDto, AtualizarBarbeiroDto, ListarBarbeirosDto } from './dto/barbeiro.dto';

@Injectable()
export class BarbeiroService {
  constructor(
    private readonly criarService: CriarBarbeiroService,
    private readonly listarService: ListarBarbeirosService,
    private readonly buscarService: BuscarBarbeiroService,
    private readonly editarService: EditarBarbeiroService,
    private readonly removerService: RemoverBarbeiroService,
  ) {}

  async criar(dto: CriarBarbeiroDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarBarbeirosDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarBarbeiroDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
