import { Injectable } from '@nestjs/common';
import { CriarFilialService } from './service/criar-filial.service';
import { ListarFiliaisService } from './service/listar-filiais.service';
import { BuscarFilialService } from './service/buscar-filial.service';
import { EditarFilialService } from './service/editar-filial.service';
import { RemoverFilialService } from './service/remover-filial.service';
import { CriarFilialDto, AtualizarFilialDto, ListarFiliaisDto } from './dto/filial.dto';

@Injectable()
export class FilialService {
  constructor(
    private readonly criarService: CriarFilialService,
    private readonly listarService: ListarFiliaisService,
    private readonly buscarService: BuscarFilialService,
    private readonly editarService: EditarFilialService,
    private readonly removerService: RemoverFilialService,
  ) {}

  async criar(dto: CriarFilialDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarFiliaisDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarFilialDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
