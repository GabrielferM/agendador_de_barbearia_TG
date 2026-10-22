import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, EstadoCarregamento, EstadoErro } from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { FormularioCadastro, estiloBotao, estiloCampo } from '../components/formulario-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import { buscarServico, consultarServicos, excluirServico, salvarServico } from './services/servicos-api';

export function ServicosAdministrador() {
  const { usuario } = useAutenticacao(), cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_SERVICOS');
  const [busca, setBusca] = useState(''), [status, setStatus] = useState(''), [pagina, setPagina] = useState(1);
  const [editor, setEditor] = useState<{ id: number | null; dados: Record<string, string>; leitura: boolean } | null>(null);
  const [excluir, setExcluir] = useState<number | null>(null), [aviso, setAviso] = useState('');
  const consulta = useQuery({ queryKey: ['admin', usuario?.id, 'servicos', busca, status, pagina], enabled: permitido, queryFn: ({ signal }) => consultarServicos({ busca, ativo: status ? status as 'true' | 'false' : undefined, pagina }, signal) });
  const abrir = useMutation({ mutationFn: buscarServico, onSuccess: (dados, id) => { setEditor({ id, dados, leitura: true }); setAviso(''); } });
  const gravar = useMutation({ mutationFn: (dados: Record<string, string>) => salvarServico(editor!.id, dados), onSuccess: async () => { setEditor(null); setAviso('Serviço salvo.'); await cache.invalidateQueries(); } });
  const remover = useMutation({ mutationFn: excluirServico, onSuccess: async () => { setExcluir(null); setAviso('Serviço excluído.'); setPagina(1); await cache.invalidateQueries(); } });
  const campos: CampoCadastro[] = [
    { nome: 'nome', rotulo: 'Nome', obrigatorio: true, tamanhoMinimo: 2 }, { nome: 'descricao', rotulo: 'Descrição' },
    { nome: 'precoBase', rotulo: 'Preço base (R$)', tipo: 'number', minimo: 0.01, passo: '0.01', obrigatorio: true },
    { nome: 'duracaoMinutos', rotulo: 'Duração (minutos)', tipo: 'number', minimo: 1, passo: '1', obrigatorio: true },
    ...(editor?.id ? [{ nome: 'ativo', rotulo: 'Situação', obrigatorio: true, opcoes: [{ valor: 'true', rotulo: 'Ativo' }, { valor: 'false', rotulo: 'Inativo' }] }] : []),
  ];
  const erro = gravar.error ?? remover.error ?? abrir.error;
  return <DashboardLayout titulo="Serviços" subtitulo="Cadastre os serviços oferecidos pela barbearia" itens={MENU_ADMINISTRADOR}>
    {!permitido ? <p role="alert">Você não possui permissão para gerenciar servicos.</p> : <>
      <div className="flex flex-wrap gap-3"><label>Buscar serviço<input className={estiloCampo} value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /></label><label>Status<select className={estiloCampo} value={status} onChange={e => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos</option><option value="true">Ativo</option><option value="false">Inativo</option></select></label><button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ id: null, dados: {}, leitura: false }); }}>Novo serviço</button></div>
      {aviso && <p role="status">{aviso}</p>}{erro && !editor && <p role="alert">{erro.message}</p>}
      {editor && <><FormularioCadastro key={`${editor.id}-${editor.leitura}`} campos={campos} valores={editor.dados} somenteLeitura={editor.leitura} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => setEditor(null)} />{editor.leitura && <button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ ...editor, leitura: false }); }}>Editar serviço</button>}</>}
      {excluir !== null && <div role="alertdialog" aria-label="Confirmar exclusão"><p>Excluir este serviço? Itens de agendamento vinculados impedem a exclusão. Para preservar o cadastro, edite a situação.</p><button className={estiloBotao} disabled={remover.isPending} onClick={() => remover.mutate(excluir)}>Confirmar exclusão</button><button className={estiloBotao} disabled={remover.isPending} onClick={() => setExcluir(null)}>Cancelar</button></div>}
      {consulta.isPending ? <EstadoCarregamento /> : consulta.isError ? <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} /> : <>
        <p className="my-4">Serviços ativos: {consulta.data.ativos} · Mais realizado: {consulta.data.maisRealizado} · Ticket médio: {consulta.data.ticketMedio.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Serviço', 'Duração', 'Preço', 'Realizados no mês', 'Receita no mês', 'Situação', 'Ações'].map(c => <th key={c} className="p-2">{c}</th>)}</tr></thead><tbody>{consulta.data.data.map(c => <tr key={c.id} className="border-t border-border"><td className="p-2">{c.nome}</td><td>{c.duracaoMinutos} min</td><td>{c.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>{c.realizadosMes}</td><td>{c.receitaMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td><td>{c.ativo ? 'Ativo' : 'Inativo'}</td><td><button className={estiloBotao} disabled={abrir.isPending} onClick={() => abrir.mutate(c.id)}>Visualizar {c.nome}</button><button className={estiloBotao} onClick={() => { remover.reset(); setExcluir(c.id); }}>Excluir {c.nome}</button></td></tr>)}</tbody></table></div>
        {!consulta.data.data.length && <p>Nenhum serviço encontrado.</p>}<nav aria-label="Paginação de servicos" className="my-4 flex gap-3"><button className={estiloBotao} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button><span>Página {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)} · {consulta.data.meta.total} servicos</span><button className={estiloBotao} disabled={pagina >= consulta.data.meta.totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button></nav>
      </>}
    </>}
  </DashboardLayout>;
}
