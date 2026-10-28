import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../../auth/contexto-autenticacao';
import { EstadoErro } from '../../../components/dashboard-compartilhado';
import { FormularioCadastro, estiloBotao, estiloCampo, estiloPrimario } from '../../components/formulario-cadastro';
import type { CampoCadastro } from '../../components/formulario-cadastro';
import { consultarComissoes, detalheComissao, itensElegiveis, profissionaisComissao, salvarComissao } from '../services/gestao-comissoes-api';
import { moeda } from '../../../components/dashboard-formatadores';
const TRANSICOES: Record<string, string[]> = { PREVISTA: ['LIBERADA', 'CANCELADA'], LIBERADA: ['PAGA', 'CANCELADA'], PAGA: ['ESTORNADA'], CANCELADA: [], ESTORNADA: [] };
export function GestaoComissoes() {
 const { usuario } = useAutenticacao(), cache = useQueryClient();
 const [aberto, setAberto] = useState(false), [pagina, setPagina] = useState(1), [status, setStatus] = useState(''), [barbeiro, setBarbeiro] = useState(''), [paginaItens, setPaginaItens] = useState(1), [aviso, setAviso] = useState('');
 const [editor, setEditor] = useState<{ id: number | null; leitura: boolean; dados: Record<string, string> } | null>(null);
 const consulta = useQuery({ queryKey: ['admin', usuario?.id, 'comissoes', pagina, status, barbeiro], enabled: aberto, queryFn: ({ signal }) => consultarComissoes(pagina, status, barbeiro, signal) });
 const profissionais = useQuery({ queryKey: ['admin', usuario?.id, 'profissionais-comissoes'], enabled: aberto, queryFn: ({ signal }) => profissionaisComissao(signal) });
 const itens = useQuery({ queryKey: ['admin', usuario?.id, 'itens-elegiveis-comissao', paginaItens], enabled: editor?.id === null, queryFn: ({ signal }) => itensElegiveis(paginaItens, signal) });
 const abrir = useMutation({ mutationFn: async ({ id, leitura }: { id: number; leitura: boolean }) => ({ id, leitura, item: await detalheComissao(id) }), onSuccess: ({ id, leitura, item }) => { gravar.reset(); setEditor({ id, leitura, dados: { ...item, id: String(item.id), statusOriginal: item.status } }); } });
 const gravar = useMutation({ mutationFn: (dados: Record<string, string>) => salvarComissao(editor!.id, dados, itens.data?.data ?? []), onSuccess: async () => { setEditor(null); setAviso('Comissão salva.'); await Promise.all([cache.invalidateQueries({ queryKey: ['admin', usuario?.id] }), cache.invalidateQueries({ queryKey: ['dashboard', 'administrador', usuario?.id] })]); } });
 const campos: CampoCadastro[] = editor?.id === null ? [
  { nome: 'idAgendamentoServico', rotulo: 'Item de atendimento concluído', obrigatorio: true, opcoes: itens.data?.data ?? [] },
  { nome: 'percentualAplicado', rotulo: 'Percentual (%)', tipo: 'number', obrigatorio: true, minimo: 0.01, maximo: 100, passo: '0.01' }, { nome: 'observacao', rotulo: 'Observação' },
 ] : [
  ...(editor?.leitura ? [{ nome: 'barbeiro', rotulo: 'Barbeiro' }, { nome: 'servico', rotulo: 'Serviço' }, { nome: 'baseCalculo', rotulo: 'Base (R$)' }, { nome: 'percentualAplicado', rotulo: 'Percentual (%)' }, { nome: 'valorComissao', rotulo: 'Comissão (R$)' }, { nome: 'dataGeracao', rotulo: 'Gerada em' }, { nome: 'dataLiberacao', rotulo: 'Liberada em' }, { nome: 'dataPagamento', rotulo: 'Paga em' }, { nome: 'dataEstorno', rotulo: 'Estornada em' }] : []),
  { nome: 'status', rotulo: 'Status da comissão', obrigatorio: true, opcoes: [editor?.dados.statusOriginal ?? '', ...(TRANSICOES[editor?.dados.statusOriginal ?? ''] ?? [])].map(valor => ({ valor, rotulo: valor })) },
  { nome: 'motivoEstorno', rotulo: 'Motivo do estorno (obrigatório ao estornar)' }, { nome: 'observacao', rotulo: 'Observação' },
 ];
 return <section aria-label="Gestão de comissões" className="my-5 rounded-xl border border-border bg-surface p-4">
  <div className="flex flex-wrap gap-3"><button className={estiloPrimario} disabled={gravar.isPending || abrir.isPending} onClick={() => { gravar.reset(); abrir.reset(); setPaginaItens(1); setEditor({ id: null, dados: {}, leitura: false }); setAberto(true); }}>Nova comissão</button><button className={estiloBotao} onClick={() => setAberto(!aberto)}>{aberto ? 'Recolher lista de comissões' : 'Gerenciar comissões'}</button></div>
  {aviso && <p role="status" className="my-3">{aviso}</p>}{abrir.error && <p role="alert">{abrir.error.message}</p>}{abrir.isPending && <p role="status">Carregando comissão…</p>}
  {editor && <>
   {editor.id === null && <><p className="my-3 text-sm text-muted">Selecione o serviço concluído; a base e o cálculo definitivo são obtidos pelo servidor.</p>{itens.isPending ? <p role="status">Carregando itens elegíveis…</p> : itens.isError ? <EstadoErro mensagem={itens.error.message} tentarNovamente={() => void itens.refetch()} /> : <><p className="text-sm">Página {paginaItens} de {Math.max(1, itens.data.meta.totalPaginas)} de atendimentos concluídos.</p>{!itens.data.data.length && <p>Nenhum item sem comissão nesta página.</p>}<button className={estiloBotao} disabled={paginaItens <= 1 || gravar.isPending} onClick={() => setPaginaItens(paginaItens - 1)}>Itens anteriores</button><button className={estiloBotao} disabled={paginaItens >= itens.data.meta.totalPaginas || gravar.isPending} onClick={() => setPaginaItens(paginaItens + 1)}>Próximos itens</button></>}</>}
   {(editor.id !== null || itens.isSuccess) && <FormularioCadastro key={`${editor.id}-${editor.leitura}-${paginaItens}`} campos={campos} valores={editor.dados} somenteLeitura={editor.leitura} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => setEditor(null)} />}
   {!editor.leitura && <p className="text-sm text-muted">PAGA registra uma quitação administrativa. O sistema não executa transferência de dinheiro. Datas de liberação, pagamento e estorno são registradas pelo servidor.</p>}
  </>}
  {aberto && <>
   <div className="admin-toolbar mt-4"><label>Status<select className={estiloCampo} value={status} onChange={e => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos</option>{Object.keys(TRANSICOES).map(s => <option key={s}>{s}</option>)}</select></label><label>Barbeiro<select className={estiloCampo} value={barbeiro} onChange={e => { setBarbeiro(e.target.value); setPagina(1); }}><option value="">Todos</option>{profissionais.data?.map(p => <option key={p.valor} value={p.valor}>{p.rotulo}</option>)}</select></label></div>
   {profissionais.isError && <p role="alert">Não foi possível carregar o filtro de profissionais.</p>}
   {consulta.isPending ? <p role="status">Carregando comissões…</p> : consulta.isError ? <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} /> : <>
    <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Barbeiro / serviço</th><th>Base</th><th>Percentual</th><th>Comissão</th><th>Status</th><th>Ações</th></tr></thead><tbody>{consulta.data.data.map(c => <tr key={c.id}><td>{c.barbeiro} · {c.servico}</td><td className="text-right">{moeda.format(Number(c.baseCalculo))}</td><td className="text-right">{c.percentualAplicado}%</td><td className="text-right">{moeda.format(Number(c.valorComissao))}</td><td>{c.status}</td><td><button className={estiloBotao} disabled={abrir.isPending || gravar.isPending} aria-label={`Visualizar comissão de ${c.barbeiro}, ${c.servico}`} onClick={() => abrir.mutate({ id: c.id, leitura: true })}>Visualizar</button><button className={estiloBotao} disabled={abrir.isPending || gravar.isPending} aria-label={`Editar comissão de ${c.barbeiro}, ${c.servico}`} onClick={() => abrir.mutate({ id: c.id, leitura: false })}>Editar</button></td></tr>)}</tbody></table></div>
    {!consulta.data.data.length && <p>{status || barbeiro ? 'Nenhuma comissão para estes filtros.' : 'Nenhuma comissão cadastrada.'}</p>}
    <nav aria-label="Paginação de comissões" className="my-3 flex flex-wrap items-center gap-3"><button className={estiloBotao} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Comissões anteriores</button><span>Página {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)} · {consulta.data.meta.total} registros</span><button className={estiloBotao} disabled={pagina >= consulta.data.meta.totalPaginas} onClick={() => setPagina(pagina + 1)}>Próximas comissões</button></nav>
   </>}
  </>}
 </section>;
}
