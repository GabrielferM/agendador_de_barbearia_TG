import { BadRequestException } from '@nestjs/common';
import {
  adicionarDias,
  dataConsultaBarbearia,
  inicioDiaBarbearia,
  inicioMesBarbearia,
} from '../../../../common/utils/periodo-dashboard';
import { LIMITE_DIAS_FINANCEIRO } from '../constants/financeiro-dashboard.constants';
import type { ConsultarFinanceiroDashboardDto } from '../dto/financeiro-dashboard.dto';
import type { PeriodoFinanceiroDashboard } from '../types/financeiro-dashboard.types';

function proximoMes(inicioMes: Date) {
  const dataIntermediaria = adicionarDias(inicioMes, 32);
  return inicioMesBarbearia(dataIntermediaria);
}

export function validarPeriodoFinanceiro(
  query: ConsultarFinanceiroDashboardDto,
  agora = new Date(),
): PeriodoFinanceiroDashboard {
  const inicioPadrao = inicioMesBarbearia(agora);
  const dataInicioInformada = query.inicioDe ? dataConsultaBarbearia(query.inicioDe) : undefined;
  const dataFimInformada = query.inicioAte ? dataConsultaBarbearia(query.inicioAte) : undefined;
  if (
    (dataInicioInformada && Number.isNaN(dataInicioInformada.getTime())) ||
    (dataFimInformada && Number.isNaN(dataFimInformada.getTime()))
  ) {
    throw new BadRequestException('Período financeiro inválido.');
  }
  const inicio = dataInicioInformada ? inicioDiaBarbearia(dataInicioInformada) : inicioPadrao;
  const fimExclusivo = dataFimInformada
    ? adicionarDias(inicioDiaBarbearia(dataFimInformada), 1)
    : proximoMes(inicio);
  if (fimExclusivo <= inicio) {
    throw new BadRequestException('inicioAte deve ser igual ou posterior a inicioDe.');
  }
  const duracaoDias = Math.round((fimExclusivo.getTime() - inicio.getTime()) / 86_400_000);
  if (duracaoDias > LIMITE_DIAS_FINANCEIRO) {
    throw new BadRequestException(
      `O período financeiro deve ter no máximo ${LIMITE_DIAS_FINANCEIRO} dias.`,
    );
  }
  const inicioAnterior = adicionarDias(inicio, -duracaoDias);
  return {
    inicio,
    fimExclusivo,
    inicioAnterior,
    fimAnteriorExclusivo: inicio,
  };
}
