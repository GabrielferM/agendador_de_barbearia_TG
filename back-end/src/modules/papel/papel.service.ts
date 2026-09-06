import { Injectable } from '@nestjs/common';
import {
  AtualizarPapelDto,
  AtualizarPapelPermissaoDto,
  CriarPapelDto,
  ListarPapeisDto,
} from './dto/papel.dto';
import { BuscarPapelService } from './service/buscar-papel.service';
import { CriarPapelService } from './service/criar-papel.service';
import { DesvincularPermissaoPapelService } from './service/desvincular-permissao-papel.service';
import { EditarPapelService } from './service/editar-papel.service';
import { EditarVinculoPapelPermissaoService } from './service/editar-vinculo-papel-permissao.service';
import { ListarPapeisService } from './service/listar-papeis.service';
import { ListarPermissoesPapelService } from './service/listar-permissoes-papel.service';
import { RemoverPapelService } from './service/remover-papel.service';
import { VincularPermissaoPapelService } from './service/vincular-permissao-papel.service';

@Injectable()
export class PapelService {
  constructor(
    private readonly criarService: CriarPapelService,
    private readonly listarService: ListarPapeisService,
    private readonly buscarService: BuscarPapelService,
    private readonly editarService: EditarPapelService,
    private readonly removerService: RemoverPapelService,
    private readonly listarPermissoesService: ListarPermissoesPapelService,
    private readonly vincularPermissaoService: VincularPermissaoPapelService,
    private readonly editarVinculoService: EditarVinculoPapelPermissaoService,
    private readonly desvincularPermissaoService: DesvincularPermissaoPapelService,
  ) {}

  async criar(dto: CriarPapelDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarPapeisDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarPapelDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }

  async listarPermissoes(idPapel: number) {
    return this.listarPermissoesService.execute(idPapel);
  }

  async vincular(idPapel: number, idPermissao: number) {
    return this.vincularPermissaoService.execute(idPapel, idPermissao);
  }

  async atualizarVinculo(idPapel: number, idPermissao: number, dto: AtualizarPapelPermissaoDto) {
    return this.editarVinculoService.execute(idPapel, idPermissao, dto);
  }

  async desvincular(idPapel: number, idPermissao: number) {
    return this.desvincularPermissaoService.execute(idPapel, idPermissao);
  }
}
