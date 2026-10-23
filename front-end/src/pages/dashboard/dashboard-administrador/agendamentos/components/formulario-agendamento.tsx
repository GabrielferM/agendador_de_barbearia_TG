import { useState } from 'react';
import type { FormEvent } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../../auth/contexto-autenticacao';
import type { AtualizarAgendamentoDto, CriarAgendamentoDto } from '../../../../../api/models';
import { estiloBotao, estiloCampo } from '../../components/formulario-cadastro';
import { consultarFiliais } from '../../barbeiros/services/barbeiros-api';
import { catalogoAgenda, clientesAgenda, consultarHorarios, dataLocal } from '../services/agendamentos-api';
import type { DetalheAgenda, ItemEditor } from '../services/agendamentos-api';

export function FormularioAgendamento({ atual, leitura, pendente, erro, salvar, fechar }: { atual: DetalheAgenda | null; leitura: boolean; pendente: boolean; erro?: string; salvar: (dados: CriarAgendamentoDto | AtualizarAgendamentoDto) => void; fechar: () => void }) {
 const { usuario } = useAutenticacao();
 const [idCliente, setCliente] = useState(atual ? String(atual.idCliente) : ''), [idFilial, setFilial] = useState(atual ? String(atual.idFilial) : ''), [idBarbeiro, setBarbeiro] = useState(atual ? String(atual.idBarbeiro) : '');
 const [inicio, setInicio] = useState(atual?.inicio ?? ''), [observacaoCliente, setObsCliente] = useState(atual?.observacaoCliente ?? ''), [observacaoInterna, setObsInterna] = useState(atual?.observacaoInterna ?? '');
 const [itens, setItens] = useState<ItemEditor[]>(atual?.servicos ?? []), [busca, setBusca] = useState(''), [pagina, setPagina] = useState(1), [servico, setServico] = useState(''), [mensagem, setMensagem] = useState('');
 const clientes = useQuery({ queryKey: ['admin', usuario?.id, 'opcoes-clientes', busca, pagina], queryFn: ({ signal }) => clientesAgenda(busca, pagina, signal), enabled: !leitura });
 const filiais = useQuery({ queryKey: ['admin', usuario?.id, 'filiais-cadastro'], queryFn: ({ signal }) => consultarFiliais(signal), enabled: !leitura });
 const catalogo = useQuery({ queryKey: ['admin', usuario?.id, 'catalogo-agenda', idFilial], queryFn: ({ signal }) => catalogoAgenda(idFilial ? Number(idFilial) : undefined, signal), enabled: !leitura });
 const horarios = useMutation({ mutationFn: () => consultarHorarios(Number(idFilial), Number(idBarbeiro), inicio.slice(0, 10), itens.map(i => i.idServico)) });
 const opcoes = (lista: { valor: string; rotulo: string }[] | undefined, valor: string, nome?: string) => [...(lista ?? []), ...(valor && !lista?.some(i => i.valor === valor) ? [{ valor, rotulo: nome || 'Seleção atual' }] : [])];
 const desabilitado = pendente || leitura;
 function enviar(e: FormEvent) {
  e.preventDefault(); if (pendente || leitura) return;
  if (!itens.length) { setMensagem('Selecione ao menos um serviço.'); return; }
  setMensagem('');
  const comum = { idCliente: Number(idCliente), idFilial: Number(idFilial), idBarbeiro: Number(idBarbeiro), observacaoCliente, observacaoInterna };
  if (!atual) salvar({ ...comum, inicio: inicio + ':00-03:00', origem: 'ADMINISTRADOR', servicos: itens });
  else salvar({ ...comum, ...(inicio !== atual.inicio ? { inicio: inicio + ':00-03:00' } : {}), ...(JSON.stringify(itens) !== JSON.stringify(atual.servicos) ? { servicos: itens } : {}) });
 }
 return <form aria-label={leitura ? 'Detalhes do agendamento' : 'Formulário de agendamento'} onSubmit={enviar} className="my-4 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
  {!leitura && <label>Buscar cliente<input className={estiloCampo} value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /></label>}
  <label>Cliente<select className={estiloCampo} required disabled={desabilitado} value={idCliente} onChange={e => setCliente(e.target.value)}><option value="">Selecione</option>{opcoes(clientes.data?.data, idCliente, atual?.nomeCliente).map(o => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}</select></label>
  {!leitura && <div className="flex items-center gap-2"><button className={estiloBotao} type="button" disabled={pagina <= 1 || clientes.isFetching} onClick={() => setPagina(pagina - 1)}>Clientes anteriores</button><span>Página {pagina} · {clientes.data?.meta.total ?? 0} clientes</span><button className={estiloBotao} type="button" disabled={!clientes.data || pagina >= clientes.data.meta.totalPaginas || clientes.isFetching} onClick={() => setPagina(pagina + 1)}>Mais clientes</button></div>}
  <label>Filial<select className={estiloCampo} required disabled={desabilitado} value={idFilial} onChange={e => { setFilial(e.target.value); setBarbeiro(''); }}><option value="">Selecione</option>{opcoes(filiais.data, idFilial, atual?.nomeFilial).map(o => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}</select></label>
  <label>Barbeiro<select className={estiloCampo} required disabled={desabilitado || !idFilial} value={idBarbeiro} onChange={e => setBarbeiro(e.target.value)}><option value="">Selecione</option>{opcoes(catalogo.data?.barbeiros, idBarbeiro, atual?.nomeBarbeiro).map(o => <option key={o.valor} value={o.valor}>{o.rotulo}</option>)}</select></label>
  <label>Início (horário de São Paulo)<input className={estiloCampo} required type="datetime-local" disabled={desabilitado} value={inicio} onChange={e => setInicio(e.target.value)} /></label>
  {!leitura && <div><button className={estiloBotao} type="button" disabled={!idFilial || !idBarbeiro || !inicio || !itens.length || itens.some(i => i.quantidade !== 1) || horarios.isPending} onClick={() => horarios.mutate()}>Consultar horários livres</button><p className="text-sm text-muted">A gravação revalida a agenda. Sugestões consideram uma unidade de cada serviço.</p>{horarios.isSuccess && <label>Horários consultados<select className={estiloCampo} defaultValue="" onChange={e => { if (e.target.value) setInicio(dataLocal(e.target.value)); }}><option value="">{horarios.data.length ? 'Selecione' : 'Sem horários livres'}</option>{horarios.data.map(h => <option key={h} value={h}>{dataLocal(h).replace('T', ' ')}</option>)}</select></label>}</div>}
  <fieldset className="sm:col-span-2"><legend>Serviços do atendimento</legend>{!leitura && <div className="flex gap-2"><label>Adicionar serviço<select className={estiloCampo} value={servico} onChange={e => setServico(e.target.value)}><option value="">Selecione</option>{catalogo.data?.servicos.filter(s => !itens.some(i => String(i.idServico) === s.valor)).map(s => <option key={s.valor} value={s.valor}>{s.rotulo}</option>)}</select></label><button className={estiloBotao} type="button" disabled={!servico || pendente} onClick={() => { setItens([...itens, { idServico: Number(servico), quantidade: 1, desconto: 0 }]); setServico(''); }}>Adicionar</button></div>}
  {itens.map((item, indice) => <div key={item.idServico} className="my-2 flex flex-wrap gap-2"><strong>{catalogo.data?.servicos.find(s => s.valor === String(item.idServico))?.rotulo ?? atual?.nomesServicos[String(item.idServico)]}</strong><label>Quantidade<input className={estiloCampo} type="number" min="1" step="1" required disabled={desabilitado} value={item.quantidade} onChange={e => setItens(itens.map((i, n) => n === indice ? { ...i, quantidade: Number(e.target.value) } : i))} /></label><label>Desconto (R$)<input className={estiloCampo} type="number" min="0" step="0.01" required disabled={desabilitado} value={item.desconto} onChange={e => setItens(itens.map((i, n) => n === indice ? { ...i, desconto: Number(e.target.value) } : i))} /></label>{!leitura && <button className={estiloBotao} type="button" disabled={pendente} onClick={() => setItens(itens.filter((_, n) => n !== indice))}>Remover serviço</button>}</div>)}</fieldset>
  <label>Observação do cliente<textarea className={estiloCampo} disabled={desabilitado} value={observacaoCliente} onChange={e => setObsCliente(e.target.value)} /></label><label>Observação interna<textarea className={estiloCampo} disabled={desabilitado} value={observacaoInterna} onChange={e => setObsInterna(e.target.value)} /></label>
  {(erro || mensagem || clientes.error || filiais.error || catalogo.error || horarios.error) && <p role="alert">{erro || mensagem || clientes.error?.message || filiais.error?.message || catalogo.error?.message || horarios.error?.message}</p>}
  <div className="flex gap-2">{!leitura && <button className={estiloBotao} disabled={pendente || clientes.isFetching || filiais.isFetching || catalogo.isFetching} type="submit">{pendente ? 'Salvando…' : 'Salvar agendamento'}</button>}<button className={estiloBotao} disabled={pendente} type="button" onClick={fechar}>Fechar</button></div>
 </form>;
}
