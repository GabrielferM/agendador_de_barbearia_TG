import { Injectable } from '@nestjs/common';
import { AtualizarPermissaoDto, CriarPermissaoDto, ListarPermissoesDto } from './dto/permissao.dto';
import { BuscarPermissaoService } from './service/buscar-permissao.service';
import { CriarPermissaoService } from './service/criar-permissao.service';
import { EditarPermissaoService } from './service/editar-permissao.service';
import { ListarPermissoesService } from './service/listar-permissoes.service';
import { RemoverPermissaoService } from './service/remover-permissao.service';

@Injectable()
export class PermissaoService {
  constructor(
    private readonly criarService: CriarPermissaoService,
    private readonly listarService: ListarPermissoesService,
    private readonly buscarService: BuscarPermissaoService,
    private readonly editarService: EditarPermissaoService,
    private readonly removerService: RemoverPermissaoService,
  ) {}

  async criar(dto: CriarPermissaoDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarPermissoesDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarPermissaoDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
