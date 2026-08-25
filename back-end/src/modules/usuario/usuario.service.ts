import { Injectable } from '@nestjs/common';
import { CriarUsuarioService } from './service/criar-usuario.service';
import { ListarUsuariosService } from './service/listar-usuarios.service';
import { BuscarUsuarioService } from './service/buscar-usuario.service';
import { EditarUsuarioService } from './service/editar-usuario.service';
import { RemoverUsuarioService } from './service/remover-usuario.service';
import { CriarUsuarioDto, AtualizarUsuarioDto, ListarUsuariosDto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    private readonly criarService: CriarUsuarioService,
    private readonly listarService: ListarUsuariosService,
    private readonly buscarService: BuscarUsuarioService,
    private readonly editarService: EditarUsuarioService,
    private readonly removerService: RemoverUsuarioService,
  ) {}

  async criar(dto: CriarUsuarioDto) {
    return this.criarService.execute(dto);
  }

  async listar(query: ListarUsuariosDto) {
    return this.listarService.execute(query);
  }

  async buscar(id: number) {
    return this.buscarService.execute(id);
  }

  async atualizar(id: number, dto: AtualizarUsuarioDto) {
    return this.editarService.execute(id, dto);
  }

  async remover(id: number) {
    return this.removerService.execute(id);
  }
}
