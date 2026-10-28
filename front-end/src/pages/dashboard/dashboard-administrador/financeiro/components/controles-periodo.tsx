import { useState } from "react";
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
  const [erro, setErro] = useState("");
  return (
    <form
      className="mb-5 flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const dias =
          (Date.parse(rascunho.inicioAte) - Date.parse(rascunho.inicioDe)) /
            86_400_000 +
          1;
        if (!Number.isFinite(dias) || dias < 1 || dias > 366) {
          setErro("Selecione um período válido de até 366 dias.");
          return;
        }
        setErro("");
        aplicar({ ...rascunho });
      }}
    >
      <label>
        De
        <input
          required
          type="date"
          className={estiloCampo}
          value={rascunho.inicioDe}
          onChange={(e) =>
            setRascunho({ ...rascunho, inicioDe: e.target.value })
          }
        />
      </label>
      <label>
        Até
        <input
          required
          type="date"
          className={estiloCampo}
          value={rascunho.inicioAte}
          onChange={(e) =>
            setRascunho({ ...rascunho, inicioAte: e.target.value })
          }
        />
      </label>
      <button className={estiloBotao} type="submit">
        Aplicar período
      </button>
      {erro && <p role="alert">{erro}</p>}
    </form>
  );
}
