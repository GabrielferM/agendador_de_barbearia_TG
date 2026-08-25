import { Injectable } from '@nestjs/common';
import { ExclusaoCascataService } from '../../../common/services/exclusao-cascata.service';

@Injectable()
export class RemoverServicoService {
  constructor(private readonly exclusao: ExclusaoCascataService) {}
  async execute(id: number) {
    await this.exclusao.servico(id);
  }
}
