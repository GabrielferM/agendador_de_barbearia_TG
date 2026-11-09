import { useState } from 'react';
import { schemaPeriodo } from '../../../../../forms/schemas-operacoes';
import { useValidacaoFormulario } from '../../../../../forms/use-validacao-formulario';
import { ErroCampo } from '../../../../../forms/erro-campo';
type Periodo = { inicioDe: string; inicioAte: string };
export function ControlesPeriodo({
  inicial,
  aplicar,
  estiloCampo,
  estiloBotao,
}: {
  inicial: Periodo;
  aplicar: (periodo: Periodo) => void;
  estiloCampo: string;
  estiloBotao: string;
}) {
  const [rascunho, setRascunho] = useState(inicial);
  const validacao = useValidacaoFormulario(schemaPeriodo);
  return (
    <form
      {...validacao.eventos}
      className="mb-5 flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        if (!validacao.validar(e)) return;
        aplicar({ ...rascunho });
      }}
    >
      <div className="min-w-0">
        <label>
          De
          <input
            required
            name="de"
            {...validacao.campo('de')}
            type="date"
            className={estiloCampo}
            value={rascunho.inicioDe}
            onChange={(e) => setRascunho({ ...rascunho, inicioDe: e.target.value })}
          />
        </label>
        <ErroCampo id={validacao.idErro('de')} mensagem={validacao.erros.de} />
      </div>
      <div className="min-w-0">
        <label>
          Até
          <input
            required
            name="ate"
            {...validacao.campo('ate')}
            type="date"
            className={estiloCampo}
            value={rascunho.inicioAte}
            onChange={(e) => setRascunho({ ...rascunho, inicioAte: e.target.value })}
          />
        </label>
        <ErroCampo id={validacao.idErro('ate')} mensagem={validacao.erros.ate} />
      </div>
      <button className={estiloBotao} type="submit">
        Aplicar período
      </button>
    </form>
  );
}
