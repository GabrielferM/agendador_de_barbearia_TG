import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, EstadoCarregamento, EstadoErro } from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { FormularioCadastro, estiloBotao, estiloCampo } from '../components/formulario-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import { buscarBarbeiro, consultarBarbeiros, excluirBarbeiro, salvarBarbeiro, consultarFiliais } from './services/barbeiros-api';

export function BarbeirosAdministrador() {
  const { usuario } = useAutenticacao(), cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_USUARIOS');
  const [busca, setBusca] = useState(''), [status, setStatus] = useState(''), [pagina, setPagina] = useState(1);
  const [editor, setEditor] = useState<{ id: number | null; dados: Record<string, string>; leitura: boolean } | null>(null);
  const [excluir, setExcluir] = useState<number | null>(null), [aviso, setAviso] = useState('');
  const consulta = useQuery({ queryKey: ['admin', usuario?.id, 'barbeiros', busca, status, pagina], enabled: permitido, queryFn: ({ signal }) => consultarBarbeiros({ busca, status: status ? status as 'ATIVO' | 'INATIVO' | 'AFASTADO' : undefined, pagina }, signal) });
  const filiais = useQuery({ queryKey: ['admin', usuario?.id, 'filiais-cadastro'], queryFn: ({ signal }) => consultarFiliais(signal), enabled: permitido });
  const abrir = useMutation({ mutationFn: buscarBarbeiro, onSuccess: dados => { setEditor({ id: abrir.variables!, dados, leitura: true }); setAviso(''); } });
  const gravar = useMutation({ mutationFn: (dados: Record<string, string>) => salvarBarbeiro(editor!.id, dados), onSuccess: async () => { setEditor(null); setAviso('Barbeiro salvo.'); await cache.invalidateQueries(); } });
  const remover = useMutation({ mutationFn: excluirBarbeiro, onSuccess: async () => { setExcluir(null); setAviso('Barbeiro excluído.'); setPagina(1); await cache.invalidateQueries(); } });
  const campos: CampoCadastro[] = [
    { nome: 'nome', rotulo: 'Nome', obrigatorio: true, tamanhoMinimo: 2 }, { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true },
    { nome: 'nomeProfissional', rotulo: 'Nome profissional', obrigatorio: true }, { nome: 'idFilial', rotulo: 'Filial', obrigatorio: true, opcoes: [...(filiais.data ?? []), ...(editor?.dados.idFilial && !filiais.data?.some(f => f.valor === editor.dados.idFilial) ? [{ valor: editor.dados.idFilial, rotulo: 'Filial atual (fora do catálogo ativo)' }] : [])] },
    { nome: 'descricao', rotulo: 'Descrição' }, { nome: 'fotoUrl', rotulo: 'Foto (URL)', tipo: 'url' }, { nome: 'dataAdmissao', rotulo: 'Admissão', tipo: 'date' },
    { nome: 'statusProfissional', rotulo: 'Status profissional', obrigatorio: true, opcoes: ['ATIVO', 'INATIVO', 'AFASTADO'].map(valor => ({ valor, rotulo: valor })) },
    ...(!editor?.leitura ? [{ nome: 'senha', rotulo: editor?.id ? 'Nova senha (opcional)' : 'Senha', tipo: 'password' as const, tamanhoMinimo: 15, obrigatorio: editor?.id === null }] : []),
  ];
  const erro = gravar.error ?? remover.error ?? abrir.error;
  return <DashboardLayout titulo="Barbeiros" subtitulo="Gerencie a equipe e acompanhe o desempenho" itens={MENU_ADMINISTRADOR}>
    {!permitido ? <p role="alert">Você não possui permissão para gerenciar barbeiros.</p> : <>
      <div className="flex flex-wrap gap-3"><label>Buscar barbeiro<input className={estiloCampo} value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /></label><label>Status<select className={estiloCampo} value={status} onChange={e => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos</option>{['ATIVO', 'INATIVO', 'AFASTADO'].map(s => <option key={s}>{s}</option>)}</select></label><button className={estiloBotao} disabled={!filiais.data?.length} onClick={() => { gravar.reset(); setEditor({ id: null, dados: { statusProfissional: 'ATIVO' }, leitura: false }); }}>Novo barbeiro</button></div>
      {filiais.isError && <p role="alert">{filiais.error.message}</p>}{filiais.isSuccess && !filiais.data.length && <p>Cadastre uma filial ativa antes de incluir um barbeiro.</p>}{aviso && <p role="status">{aviso}</p>}{erro && !editor && <p role="alert">{erro.message}</p>}
      {editor && <><FormularioCadastro key={`${editor.id}-${editor.leitura}`} campos={campos} valores={editor.dados} somenteLeitura={editor.leitura} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => setEditor(null)} />{editor.leitura && <button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ ...editor, leitura: false }); }}>Editar barbeiro</button>}</>}
      {excluir !== null && <div role="alertdialog" aria-label="Confirmar exclusão"><p>Excluir este barbeiro? Agendamentos ou comissões vinculadas impedem a exclusão. Para preservar o cadastro, edite o status profissional.</p><button className={estiloBotao} disabled={remover.isPending} onClick={() => remover.mutate(excluir)}>Confirmar exclusão</button><button className={estiloBotao} disabled={remover.isPending} onClick={() => setExcluir(null)}>Cancelar</button></div>}
      {consulta.isPending ? <EstadoCarregamento /> : consulta.isError ? <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} /> : <>
        <p className="my-4">Barbeiros ativos: {consulta.data.ativos} · Atendimentos no mês: {consulta.data.atendimentosMes} · Comissões a pagar: {consulta.data.comissoesAPagar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Barbeiro', 'Filial', 'Hoje', 'Receita no mês', 'Comissões a pagar', 'Status profissional', 'Ações'].map(c => <th key={c} className="p-2">{c}</th>)}</tr></thead><tbody>{consulta.data.data.map(c => <tr key={c.id} className="border-t border-border"><td className="p-2">{c.nome}</td><td>{c.filial}</td><td>{c.atendimentosHoje}</td><td>{c.receitaMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>{c.comissoesAPagar.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>{c.status}</td><td><button className={estiloBotao} disabled={abrir.isPending} onClick={() => abrir.mutate(c.id)}>Visualizar {c.nome}</button><button className={estiloBotao} onClick={() => { remover.reset(); setExcluir(c.id); }}>Excluir {c.nome}</button></td></tr>)}</tbody></table></div>
        {!consulta.data.data.length && <p>Nenhum barbeiro encontrado.</p>}<nav aria-label="Paginação de barbeiros" className="my-4 flex gap-3"><button className={estiloBotao} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button><span>Página {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)} · {consulta.data.meta.total} barbeiros</span><button className={estiloBotao} disabled={pagina >= consulta.data.meta.totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button></nav>
      </>}
    </>}
  </DashboardLayout>;
}
