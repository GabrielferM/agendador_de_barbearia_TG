import { validarPeriodoFinanceiro } from './periodo-financeiro.validator';

describe('validarPeriodoFinanceiro', () => {
  it('usa o mês atual e calcula um período anterior de mesma duração', () => {
    const periodo = validarPeriodoFinanceiro({}, new Date('2026-09-11T12:00:00-03:00'));

    expect(periodo.inicio.toISOString()).toBe('2026-09-01T03:00:00.000Z');
    expect(periodo.fimExclusivo.toISOString()).toBe('2026-10-01T03:00:00.000Z');
    expect(periodo.inicioAnterior.toISOString()).toBe('2026-08-02T03:00:00.000Z');
  });

  it('aceita período personalizado inclusivo', () => {
    const periodo = validarPeriodoFinanceiro({
      inicioDe: '2026-09-01',
      inicioAte: '2026-09-10',
    });

    expect(periodo.fimExclusivo.toISOString()).toBe('2026-09-11T03:00:00.000Z');
  });
});
