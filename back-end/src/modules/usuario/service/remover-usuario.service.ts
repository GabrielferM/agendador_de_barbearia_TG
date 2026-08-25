import { Injectable } from '@nestjs/common';
import { ExclusaoCascataService } from '../../../common/services/exclusao-cascata.service';
import { BuscarUsuarioService } from './buscar-usuario.service';

@Injectable()
export class RemoverUsuarioService {
  constructor(
    private readonly exclusao: ExclusaoCascataService,
    private readonly buscar: BuscarUsuarioService,
  ) {}
  async execute(id: number) {
    await this.buscar.execute(id);
    await this.exclusao.usuario(id);
  }
}
