import { Injectable } from '@nestjs/common';

@Injectable()
export class CalcularFimAgendamentoService {
  execute(inicio: Date, servicos: { duracaoMinutos: number }[]) {
    return new Date(
      inicio.getTime() + servicos.reduce((total, item) => total + item.duracaoMinutos, 0) * 60000,
    );
  }
}
