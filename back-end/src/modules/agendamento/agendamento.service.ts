import { Injectable } from '@nestjs/common';
import { CriarAgendamentoService } from './service/criar-agendamento.service';
import { ListarAgendamentosService } from './service/listar-agendamentos.service';
import { BuscarAgendamentoService } from './service/buscar-agendamento.service';
import { EditarAgendamentoService } from './service/editar-agendamento.service';
import { RemoverAgendamentoService } from './service/remover-agendamento.service';
import {
  CriarAgendamentoDto,
  AtualizarAgendamentoDto,
  ListarAgendamentosDto,
} from './dto/agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly criarService: CriarAgendamentoService,
    private readonly listarService: ListarAgendamentosService,
    private readonly buscarService: BuscarAgendamentoService,
    private readonly editarService: EditarAgendamentoService,
    private readonly removerService: RemoverAgendamentoService,
  ) {}

  async criar(dto: CriarAgendamentoDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarAgendamentosDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarAgendamentoDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
