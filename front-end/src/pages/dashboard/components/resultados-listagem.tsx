import { useLayoutEffect, useRef, type ReactNode } from 'react';

export function ResultadosListagem({
  atualizando, erro, tentarNovamente, children,
}: {
  atualizando: boolean;
  erro: boolean;
  tentarNovamente: () => void;
  children: ReactNode;
}) {
  const regiao = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const elemento = regiao.current;
    if (!elemento) return;
    elemento.style.minHeight = atualizando ? `${elemento.getBoundingClientRect().height}px` : '';
  }, [atualizando]);
  return (
    <div ref={regiao} aria-busy={atualizando} aria-label="Resultados da consulta">
      <div className="min-h-8 px-4 pb-2 text-sm">
        <p role="status" aria-live="polite">
          {atualizando ? 'Atualizando resultados…' : ''}
        </p>
        {erro && (
          <div role="alert">
            Não foi possível atualizar os resultados. Os dados exibidos são da última consulta concluída.{' '}
            <button type="button" className="text-primary underline" disabled={atualizando} onClick={tentarNovamente}>
              Tentar novamente
            </button>
          </div>
        )}
      </div>
      {children}
    </div>
  );
}
