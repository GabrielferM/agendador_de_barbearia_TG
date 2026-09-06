import { Injectable } from '@nestjs/common';
import { AtualizarComissaoDto, CriarComissaoDto, ListarComissoesDto } from './dto/comissao.dto';
import { BuscarComissaoService } from './service/buscar-comissao.service';
import { CriarComissaoService } from './service/criar-comissao.service';
import { EditarComissaoService } from './service/editar-comissao.service';
import { ListarComissoesService } from './service/listar-comissoes.service';

@Injectable()
export class ComissaoService {
  constructor(
    private readonly criarService: CriarComissaoService,
    private readonly listarService: ListarComissoesService,
    private readonly buscarService: BuscarComissaoService,
    private readonly editarService: EditarComissaoService,
  ) {}

  async criar(dto: CriarComissaoDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarComissoesDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarComissaoDto) {
    return this.editarService.execute(id, dto);
  }
}
