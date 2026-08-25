import { Injectable } from '@nestjs/common';
import { CriarClienteService } from './service/criar-cliente.service';
import { ListarClientesService } from './service/listar-clientes.service';
import { BuscarClienteService } from './service/buscar-cliente.service';
import { EditarClienteService } from './service/editar-cliente.service';
import { RemoverClienteService } from './service/remover-cliente.service';
import { CriarClienteDto, AtualizarClienteDto, ListarClientesDto } from './dto/cliente.dto';

@Injectable()
export class ClienteService {
  constructor(
    private readonly criarService: CriarClienteService,
    private readonly listarService: ListarClientesService,
    private readonly buscarService: BuscarClienteService,
    private readonly editarService: EditarClienteService,
    private readonly removerService: RemoverClienteService,
  ) {}

  async criar(dto: CriarClienteDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarClientesDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarClienteDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
