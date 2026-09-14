import { BadRequestException } from '@nestjs/common';
import {
  adicionarDias,
  dataConsultaBarbearia,
  inicioDiaBarbearia,
} from '../../../../common/utils/periodo-dashboard';
import { LIMITE_DIAS_AGENDA } from '../constants/agendamento-dashboard.constants';
import type { ConsultarAgendaDashboardDto } from '../dto/agendamento-dashboard.dto';
import type { PeriodoAgendaDashboard } from '../types/agendamento-dashboard.types';

export function validarPeriodoAgenda(
  query: ConsultarAgendaDashboardDto,
  agora = new Date(),
): PeriodoAgendaDashboard {
  const hoje = inicioDiaBarbearia(agora);
  const deslocamentoSegunda = (hoje.getUTCDay() + 6) % 7;
  const inicioPadrao = adicionarDias(hoje, -deslocamentoSegunda);
  const dataInicioInformada = query.inicioDe ? dataConsultaBarbearia(query.inicioDe) : undefined;
  const dataFimInformada = query.inicioAte ? dataConsultaBarbearia(query.inicioAte) : undefined;

  if (
    (dataInicioInformada && Number.isNaN(dataInicioInformada.getTime())) ||
    (dataFimInformada && Number.isNaN(dataFimInformada.getTime()))
  ) {
    throw new BadRequestException('Período da agenda inválido.');
  }
  const inicio = dataInicioInformada ? inicioDiaBarbearia(dataInicioInformada) : inicioPadrao;
  const fimInclusivo = dataFimInformada
    ? inicioDiaBarbearia(dataFimInformada)
    : adicionarDias(inicio, 6);
  if (fimInclusivo < inicio) {
    throw new BadRequestException('inicioAte deve ser igual ou posterior a inicioDe.');
  }
  const dias = Math.round((fimInclusivo.getTime() - inicio.getTime()) / 86_400_000) + 1;
  if (dias > LIMITE_DIAS_AGENDA) {
    throw new BadRequestException(
      `O período da agenda deve ter no máximo ${LIMITE_DIAS_AGENDA} dias.`,
    );
  }
  return { inicio, fimExclusivo: adicionarDias(fimInclusivo, 1) };
}
