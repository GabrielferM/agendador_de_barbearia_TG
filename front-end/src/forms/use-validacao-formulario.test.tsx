import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useValidacaoFormulario } from './use-validacao-formulario';
import { schemaPeriodo } from './schemas-operacoes';
import { ErroCampo } from './erro-campo';

it('preserva filtros inválidos, foca o campo e revalida erros relacionados ao corrigir outra data', () => {
  const aplicar = vi.fn();
  function Filtros() {
    const v = useValidacaoFormulario(schemaPeriodo);
    return (
      <form
        {...v.eventos}
        aria-label="Filtros"
        onSubmit={(e) => {
          if (v.validar(e)) aplicar();
        }}
      >
        <label>
          De
          <input
            name="de"
            aria-label="De"
            type="date"
            defaultValue="2026-11-05"
            {...v.campo('de')}
          />
        </label>
        <label>
          Até
          <input
            name="ate"
            aria-label="Até"
            type="date"
            defaultValue="2026-11-03"
            {...v.campo('ate')}
          />
        </label>
        <ErroCampo id={v.idErro('ate')} mensagem={v.erros.ate} />
        <button>Aplicar</button>
      </form>
    );
  }
  render(<Filtros />);
  fireEvent.submit(screen.getByRole('form'));
  expect(aplicar).not.toHaveBeenCalled();
  expect(screen.getByLabelText('Até')).toHaveFocus();
  expect(screen.getByLabelText('Até')).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByLabelText('De')).toHaveValue('2026-11-05');
  fireEvent.change(screen.getByLabelText('De'), { target: { value: '2026-11-01' } });
  expect(screen.getByLabelText('Até')).toHaveAttribute('aria-invalid', 'false');
  fireEvent.submit(screen.getByRole('form'));
  expect(aplicar).toHaveBeenCalledTimes(1);
});
