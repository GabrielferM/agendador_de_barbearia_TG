import { Injectable } from '@nestjs/common';
import { ExclusaoCascataService } from '../../../common/services/exclusao-cascata.service';

@Injectable()
export class RemoverFilialService {
  constructor(private readonly exclusao: ExclusaoCascataService) {}

  async execute(id: number) {
    await this.exclusao.filial(id);
  }
}
