import { validarPeriodoAgenda } from './periodo-agenda.validator';

describe('validarPeriodoAgenda', () => {
  it('usa a semana atual por padrão', () => {
    const periodo = validarPeriodoAgenda({}, new Date('2026-09-09T12:00:00-03:00'));

    expect(periodo.inicio.toISOString()).toBe('2026-09-07T03:00:00.000Z');
    expect(periodo.fimExclusivo.toISOString()).toBe('2026-09-14T03:00:00.000Z');
  });

  it('interpreta datas sem horário no fuso da barbearia', () => {
    const periodo = validarPeriodoAgenda({ inicioDe: '2026-09-01', inicioAte: '2026-09-03' });

    expect(periodo.inicio.toISOString()).toBe('2026-09-01T03:00:00.000Z');
    expect(periodo.fimExclusivo.toISOString()).toBe('2026-09-04T03:00:00.000Z');
  });

  it('rejeita período invertido ou superior a 31 dias', () => {
    expect(() => validarPeriodoAgenda({ inicioDe: '2026-09-10', inicioAte: '2026-09-01' })).toThrow(
      'inicioAte deve ser igual ou posterior a inicioDe.',
    );
    expect(() => validarPeriodoAgenda({ inicioDe: '2026-01-01', inicioAte: '2026-02-02' })).toThrow(
      'no máximo 31 dias',
    );
  });
});
