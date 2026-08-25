import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class ValidarDataHoraAgendamentoService {
  execute(valor: string) {
    if (!/(Z|[+-]\d{2}:\d{2})$/i.test(valor))
      throw new BadRequestException('Início deve usar ISO 8601 com fuso horário.');

    const data = new Date(valor);
    if (Number.isNaN(data.getTime())) throw new BadRequestException('Data inválida.');

    return data;
  }
}
