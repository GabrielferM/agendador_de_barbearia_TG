import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';

export interface CampoCadastro {
  nome: string; rotulo: string; tipo?: 'text' | 'email' | 'password' | 'date' | 'number' | 'url' | 'datetime-local';
  multiplo?: boolean; ajuda?: string;
  obrigatorio?: boolean; minimo?: number; maximo?: number; passo?: string; tamanhoMinimo?: number;
  opcoes?: { valor: string; rotulo: string }[];
}
export const estiloCampo = 'min-h-11 w-full min-w-0 rounded-lg border border-border bg-surface px-3 py-2 text-foreground focus-visible:outline-primary';
export const estiloBotao = 'rounded-lg border border-border bg-surface px-3 py-2 text-sm focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50';
export const estiloPrimario = 'min-h-11 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover focus-visible:outline-primary disabled:opacity-50';
export function FormularioCadastro({ campos, valores, pendente, erro, somenteLeitura = false, salvar, fechar, aoAlterar }: {
  campos: CampoCadastro[]; valores: Record<string, string>; pendente: boolean; erro?: string;
  aoAlterar?: (dados: Record<string, string>) => void;
  somenteLeitura?: boolean; salvar: (dados: Record<string, string>) => void; fechar: () => void;
}) {
  const [dados, setDados] = useState(valores);
  const formulario = useRef<HTMLFormElement>(null);
  useEffect(() => { formulario.current?.querySelector<HTMLElement>('input:not(:disabled), select:not(:disabled), button')?.focus(); }, []);
  function alterar(nome: string, valor: string) { const novos = { ...dados, [nome]: valor }; setDados(novos); aoAlterar?.(novos); }
  function enviar(evento: FormEvent) { evento.preventDefault(); if (!pendente) salvar(dados); }
  return <form ref={formulario} aria-busy={pendente} onSubmit={enviar} className="my-4 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2" aria-label={somenteLeitura ? 'Detalhes do cadastro' : 'Formulário de cadastro'}>
    {campos.map(c => <label key={c.nome} className="grid gap-1 text-sm">{c.rotulo}
      {c.opcoes ? <select multiple={c.multiplo} className={estiloCampo} disabled={pendente || somenteLeitura} required={c.obrigatorio} value={c.multiplo ? (dados[c.nome] || '').split(',').filter(Boolean) : dados[c.nome] ?? ''} onChange={e => alterar(c.nome, c.multiplo ? Array.from(e.target.selectedOptions).map(o => o.value).join(',') : e.target.value)}>
        {!c.multiplo && <option value="">Selecione</option>}{c.opcoes.map(o => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}
      </select> : <input className={estiloCampo} type={c.tipo ?? 'text'} required={c.obrigatorio} min={c.minimo} max={c.maximo} step={c.passo} minLength={c.tamanhoMinimo} maxLength={c.tipo === 'password' ? 128 : undefined} autoComplete={c.tipo === 'password' ? 'new-password' : undefined} disabled={pendente || somenteLeitura} value={dados[c.nome] ?? ''} onChange={e => alterar(c.nome, e.target.value)} />}
    {c.ajuda && <span className="text-xs text-muted">{c.ajuda}</span>}</label>)}
    {erro && <p role="alert" className="text-danger sm:col-span-2">{erro}</p>}
    <div className="flex gap-2 sm:col-span-2">{!somenteLeitura && <button className={estiloPrimario} disabled={pendente} type="submit">{pendente ? 'Salvando…' : 'Salvar'}</button>}<button className={estiloBotao} disabled={pendente} type="button" onClick={fechar}>Fechar</button></div>
  </form>;
}
