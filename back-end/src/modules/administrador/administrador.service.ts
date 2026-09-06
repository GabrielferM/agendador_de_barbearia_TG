import { Injectable } from '@nestjs/common';
import {
  AtualizarAdministradorDto,
  CriarAdministradorDto,
  ListarAdministradoresDto,
} from './dto/administrador.dto';
import { BuscarAdministradorService } from './service/buscar-administrador.service';
import { CriarAdministradorService } from './service/criar-administrador.service';
import { EditarAdministradorService } from './service/editar-administrador.service';
import { ListarAdministradoresService } from './service/listar-administradores.service';
import { RemoverAdministradorService } from './service/remover-administrador.service';

@Injectable()
export class AdministradorService {
  constructor(
    private readonly criarService: CriarAdministradorService,
    private readonly listarService: ListarAdministradoresService,
    private readonly buscarService: BuscarAdministradorService,
    private readonly editarService: EditarAdministradorService,
    private readonly removerService: RemoverAdministradorService,
  ) {}

  async criar(dto: CriarAdministradorDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarAdministradoresDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarAdministradorDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
