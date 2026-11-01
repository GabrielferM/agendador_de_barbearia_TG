import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { estiloBotao } from './formulario-cadastro';
import './painel-catalogo.css';

export function PainelCatalogo({ children }: { children: ReactNode }) {
  return <section aria-label="Painel de consulta" className="painel-catalogo min-w-0 rounded-xl border border-border bg-surface">{children}</section>;
}
export function FaixaIndicadores({ itens }: { itens: { titulo: string; valor: string; detalhe?: string }[] }) {
  return <dl className="grid divide-y divide-border border-b border-border p-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">{itens.map(i => <div key={i.titulo} className="min-w-0 px-3 py-2"><dt className="text-sm text-foreground">{i.titulo}</dt><dd className="mt-1 break-words text-xl font-semibold tabular-nums">{i.valor}</dd>{i.detalhe && <dd className="mt-1 text-xs text-foreground">{i.detalhe}</dd>}</div>)}</dl>;
}
export function PaginacaoCatalogo({ pagina, totalPaginas, total, entidade, mudar }: { pagina: number; totalPaginas: number; total: number; entidade: string; mudar: (pagina: number) => void }) {
  return <nav aria-label={`Paginação de ${entidade}`} className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4 text-sm"><span>{total} {total === 1 ? entidade.slice(0, -1) : entidade}</span><div className="flex flex-wrap items-center gap-3"><button className={estiloBotao} disabled={pagina <= 1} onClick={() => mudar(pagina - 1)}>Anterior</button><span className="tabular-nums">Página {pagina} de {Math.max(1, totalPaginas)}</span><button className={estiloBotao} disabled={pagina >= totalPaginas} onClick={() => mudar(pagina + 1)}>Próxima</button></div></nav>;
}
export function ConfirmacaoExclusao({ children, fechar, pendente }: { children: ReactNode; fechar: () => void; pendente: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); ref.current?.querySelector<HTMLButtonElement>('[data-foco-inicial]')?.focus(); }, []);
  return <dialog role="alertdialog" ref={ref} aria-label="Confirmar exclusão" className="m-auto w-full max-w-lg rounded-xl border border-border bg-surface p-5 text-foreground backdrop:bg-foreground/40" onCancel={e => { e.preventDefault(); if (!pendente) fechar(); }}>{children}</dialog>;
}
