import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../../auth/contexto-autenticacao';
import { EstadoErro } from '../../../components/dashboard-compartilhado';
import { FormularioCadastro, estiloBotao, estiloPrimario, estiloCampo } from '../../components/formulario-cadastro';
import type { CampoCadastro } from '../../components/formulario-cadastro';
import { useGestaoCadastro } from '../../components/gestao-cadastro';
import { EditorCadastro, AcoesCadastro } from '../../components/editor-cadastro';
import { carregarAgendamento, salvarAgendamentoAdmin, excluirAgendamentoAdmin, opcoesAgenda, historicoAgenda } from '../services/gestao-agenda-api';
import { buscarHorarios } from '../../../../agendamento/services/agendamento-api';
import type { DiaAgenda } from '../types';

const TRANSICOES: Record<string, string[]> = { PENDENTE: ['CONFIRMADO', 'CANCELADO'], CONFIRMADO: ['EM_ATENDIMENTO', 'CANCELADO', 'NAO_COMPARECEU'], EM_ATENDIMENTO: ['CONCLUIDO'], CONCLUIDO: [], CANCELADO: [], NAO_COMPARECEU: [] };
export function GestaoAgenda({ dias, filtros, alterarFiltros }: { dias: DiaAgenda[]; filtros: { idCliente: string; idBarbeiro: string; status: string }; alterarFiltros: (f: typeof filtros) => void }) {
 const { usuario } = useAutenticacao();
 const g = useGestaoCadastro({ buscar: carregarAgendamento, salvar: salvarAgendamentoAdmin, excluir: excluirAgendamentoAdmin }, () => undefined);
 const [rascunho, setRascunho] = useState<Record<string, string>>({});
 const [seletoresAtivos, setSeletoresAtivos] = useState(false);
 const [buscaCliente, setBuscaCliente] = useState('');
 const [paginaHistorico, setPaginaHistorico] = useState(1);
 const opcoes = useQuery({ queryKey: ['admin', usuario?.id, 'opcoes-agenda'], queryFn: ({ signal }) => opcoesAgenda(signal), enabled: !!g.editor || seletoresAtivos });
 const d = Object.keys(rascunho).length ? rascunho : g.editor?.dados ?? {};
 const horarios = useQuery({ queryKey: ['admin', usuario?.id, 'disponibilidade', d.idFilial, d.idBarbeiro, d.inicio?.slice(0, 10), d.servicoIds], enabled: !!g.editor && !g.editor.leitura && !!d.idFilial && !!d.idBarbeiro && !!d.inicio && !!d.servicoIds, queryFn: ({ signal }) => buscarHorarios({ idFilial: Number(d.idFilial), idBarbeiro: Number(d.idBarbeiro), data: d.inicio.slice(0, 10), servicoIds: d.servicoIds.split(',').map(Number) }, signal) });
 const historico = useQuery({ queryKey: ['admin', usuario?.id, 'historico-agenda', g.editor?.id, paginaHistorico], enabled: !!g.editor?.id, queryFn: ({ signal }) => historicoAgenda(g.editor!.id!, paginaHistorico, signal) });
 const manterAtual = (opcoes: { valor: string; rotulo: string }[], campo: string, nome: string) => g.editor?.id && g.editor.dados[campo] && !opcoes.some(o => o.valor === g.editor!.dados[campo]) ? [...opcoes, { valor: g.editor.dados[campo], rotulo: g.editor.dados[nome] }] : opcoes;
 const campos: CampoCadastro[] = [
  { nome: 'idCliente', rotulo: 'Cliente', obrigatorio: true, opcoes: manterAtual(opcoes.data?.clientes.filter(c => c.rotulo.toLowerCase().includes(buscaCliente.toLowerCase())) ?? [], 'idCliente', 'clienteNome') },
  { nome: 'idFilial', rotulo: 'Filial', obrigatorio: true, opcoes: manterAtual(opcoes.data?.filiais ?? [], 'idFilial', 'filialNome') },
  { nome: 'idBarbeiro', rotulo: 'Barbeiro', obrigatorio: true, opcoes: manterAtual(opcoes.data?.barbeiros.filter(b => !d.idFilial || b.idFilial === Number(d.idFilial)) ?? [], 'idBarbeiro', 'barbeiroNome') },
  { nome: 'inicio', rotulo: 'Início (São Paulo)', tipo: 'datetime-local', obrigatorio: true },
  ...(g.editor?.leitura ? [{ nome: 'servicosAtuais', rotulo: 'Serviços registrados' }] : [{ nome: 'servicoIds', rotulo: g.editor?.id ? 'Substituir serviços (opcional)' : 'Serviços', multiplo: true, obrigatorio: g.editor?.id === null, ajuda: 'Selecione um ou mais serviços. Na edição, deixe vazio para preservar os itens e valores registrados.', opcoes: opcoes.data?.servicos ?? [] }]),
  { nome: 'observacaoCliente', rotulo: 'Observação do cliente' }, { nome: 'observacaoInterna', rotulo: 'Observação interna' },
  ...(g.editor?.id ? [{ nome: 'status', rotulo: 'Status', obrigatorio: true, opcoes: [g.editor.dados.status, ...(TRANSICOES[g.editor.dados.status] ?? [])].map(valor => ({ valor, rotulo: valor.replaceAll('_', ' ') })) }, { nome: 'motivoCancelamento', rotulo: 'Motivo do cancelamento', obrigatorio: d.status === 'CANCELADO' && g.editor.dados.status !== 'CANCELADO' }] : []),
 ];
 const itens = dias.flatMap(dia => dia.agendamentos);
 return <section aria-label="Gestão de agendamentos" className="my-5">
  <button className={estiloPrimario} disabled={g.gravar.isPending || g.abrir.isPending} onClick={() => { setRascunho({}); g.novo(); }}>Novo agendamento</button>
  <div className="admin-toolbar mt-4">
   <button className={estiloBotao} disabled={opcoes.isFetching} onClick={() => setSeletoresAtivos(true)}>Carregar opções dos filtros</button>
   <label>Filtrar cliente<select className={estiloCampo} disabled={!opcoes.data} value={filtros.idCliente} onChange={e => alterarFiltros({ ...filtros, idCliente: e.target.value })}><option value="">Todos</option>{opcoes.data?.clientes.map(c => <option key={c.valor} value={c.valor}>{c.rotulo}</option>)}</select></label>
   <label>Filtrar barbeiro<select className={estiloCampo} disabled={!opcoes.data} value={filtros.idBarbeiro} onChange={e => alterarFiltros({ ...filtros, idBarbeiro: e.target.value })}><option value="">Todos</option>{opcoes.data?.barbeiros.map(b => <option key={b.valor} value={b.valor}>{b.rotulo}</option>)}</select></label>
   <label>Status<select className={estiloCampo} value={filtros.status} onChange={e => alterarFiltros({ ...filtros, status: e.target.value })}><option value="">Todos</option>{Object.keys(TRANSICOES).map(s => <option key={s} value={s}>{s.replaceAll('_', ' ')}</option>)}</select></label>
  </div>
  {seletoresAtivos && opcoes.isError && !g.editor && <EstadoErro mensagem={opcoes.error.message} tentarNovamente={() => void opcoes.refetch()} />}
  {g.editor && <>
   {opcoes.isPending ? <p role="status">Carregando cadastros…</p> : opcoes.isError ? <EstadoErro mensagem={opcoes.error.message} tentarNovamente={() => void opcoes.refetch()} /> : <>
    {!g.editor.leitura && <label className="my-3 grid gap-1 text-sm">Pesquisar cliente<input className={estiloCampo} value={buscaCliente} onChange={e => setBuscaCliente(e.target.value)} /></label>}
    <FormularioCadastro key={`${g.editor.id}-${g.editor.leitura}`} campos={campos} valores={g.editor.dados} aoAlterar={setRascunho} somenteLeitura={g.editor.leitura || !!g.editor.id && !TRANSICOES[g.editor.dados.status]?.length} pendente={g.gravar.isPending} erro={g.gravar.error?.message} salvar={dados => g.gravar.mutate(dados)} fechar={() => { g.setEditor(null); setRascunho({}); }} />
    {!g.editor.leitura && <p className="my-2 text-sm text-muted">O horário é revalidado ao salvar. A consulta não reserva a agenda.</p>}
    {horarios.isFetching && <p role="status">Consultando horários…</p>}{horarios.isError && <p role="alert">{horarios.error.message}</p>}
    {horarios.data && <p className="text-sm">Horários livres: {horarios.data.horarios.length ? horarios.data.horarios.map(h => new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', timeStyle: 'short' }).format(new Date(h.inicio))).join(', ') : 'Nenhum horário disponível'}</p>}
   </>}
   {g.editor.id && <div className="my-3 rounded-lg border border-border p-4"><h3 className="font-semibold">Histórico de status</h3>{historico.isPending ? <p role="status">Carregando histórico…</p> : historico.isError ? <p role="alert">{historico.error.message}</p> : <><ul>{historico.data.data.map(h => <li key={h.id}>{h.status} · {new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(h.data))} · {h.responsavel}</li>)}</ul>{!historico.data.data.length && <p>Sem histórico registrado.</p>}<button className={estiloBotao} disabled={paginaHistorico <= 1} onClick={() => setPaginaHistorico(paginaHistorico - 1)}>Histórico anterior</button><button className={estiloBotao} disabled={paginaHistorico >= historico.data.meta.totalPaginas} onClick={() => setPaginaHistorico(paginaHistorico + 1)}>Próximo histórico</button></>}</div>}
  </>}
  <EditorCadastro gestao={{ ...g, editor: null }} campos={[]} />
  {!!itens.length && <div className="my-4 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Início</th><th>Cliente</th><th>Barbeiro</th><th>Status</th><th>Ações</th></tr></thead><tbody>{itens.map(i => <tr key={i.id}><td>{new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(i.inicio))}</td><td>{i.cliente}</td><td>{i.barbeiro}</td><td>{i.status}</td><td onClick={() => { setRascunho({}); setPaginaHistorico(1); }}><AcoesCadastro gestao={g} id={i.id} nome={`${i.cliente}, agendamento ${i.id}`} /></td></tr>)}</tbody></table></div>}
 </section>;
}
