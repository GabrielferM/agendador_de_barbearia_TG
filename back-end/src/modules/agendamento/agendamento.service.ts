import { Injectable } from '@nestjs/common';
import { CriarAgendamentoService } from './service/criar-agendamento.service';
import { ListarAgendamentosService } from './service/listar-agendamentos.service';
import { BuscarAgendamentoService } from './service/buscar-agendamento.service';
import { EditarAgendamentoService } from './service/editar-agendamento.service';
import { RemoverAgendamentoService } from './service/remover-agendamento.service';
import { HistoricoStatusAgendamentoService } from './service/historico-status-agendamento.service';
import {
  CriarAgendamentoDto,
  AtualizarAgendamentoDto,
  ListarAgendamentosDto,
  ListarHistoricoStatusDto,
  CriarHistoricoStatusDto,
} from './dto/agendamento.dto';

@Injectable()
export class AgendamentoService {
  constructor(
    private readonly criarService: CriarAgendamentoService,
    private readonly listarService: ListarAgendamentosService,
    private readonly buscarService: BuscarAgendamentoService,
    private readonly editarService: EditarAgendamentoService,
    private readonly removerService: RemoverAgendamentoService,
    private readonly historicoService: HistoricoStatusAgendamentoService,
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
  async listarHistorico(id: number, query: ListarHistoricoStatusDto) {
    return this.historicoService.listar(id, query);
  }
  async criarHistorico(id: number, dto: CriarHistoricoStatusDto) {
    return this.historicoService.criar(id, dto);
  }
}
