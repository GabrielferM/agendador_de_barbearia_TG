import { render, screen } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ResultadosListagem } from './resultados-listagem';

afterEach(() => vi.restoreAllMocks());

it('reserva a altura durante atualização sem desmontar os itens e libera ao concluir', () => {
  vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
    height: 400, width: 300, x: 0, y: 0, top: 0, left: 0, right: 300, bottom: 400,
    toJSON: () => ({}),
  });
  const montar = (atualizando: boolean) => (
    <ResultadosListagem atualizando={atualizando} erro={false} tentarNovamente={vi.fn()}>
      <table><tbody><tr><td>Maria</td></tr></tbody></table>
    </ResultadosListagem>
  );
  const { rerender } = render(montar(false));
  const item = screen.getByText('Maria');
  rerender(montar(true));
  expect(screen.getByText('Maria')).toBe(item);
  expect(screen.getByLabelText('Resultados da consulta')).toHaveStyle({ minHeight: '400px' });
  expect(screen.getByRole('status')).toHaveTextContent('Atualizando resultados…');
  rerender(montar(false));
  expect(screen.getByLabelText('Resultados da consulta').style.minHeight).toBe('');
  expect(screen.getByText('Maria')).toBe(item);
});
