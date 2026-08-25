import { Injectable } from '@nestjs/common';
import { CriarEnderecoService } from './service/criar-endereco.service';
import { ListarEnderecosService } from './service/listar-enderecos.service';
import { BuscarEnderecoService } from './service/buscar-endereco.service';
import { EditarEnderecoService } from './service/editar-endereco.service';
import { RemoverEnderecoService } from './service/remover-endereco.service';
import { CriarEnderecoDto, AtualizarEnderecoDto, ListarEnderecosDto } from './dto/endereco.dto';

@Injectable()
export class EnderecoService {
  constructor(
    private readonly criarService: CriarEnderecoService,
    private readonly listarService: ListarEnderecosService,
    private readonly buscarService: BuscarEnderecoService,
    private readonly editarService: EditarEnderecoService,
    private readonly removerService: RemoverEnderecoService,
  ) {}

  async criar(dto: CriarEnderecoDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarEnderecosDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarEnderecoDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
