import { Injectable } from '@nestjs/common';
import { ServicoRepository } from '../../servico.repository';

@Injectable()
export class ListarServicosService {
  constructor(private readonly servicoRepository: ServicoRepository) {}

  async execute() {
    return this.servicoRepository.listar();
  }
}
