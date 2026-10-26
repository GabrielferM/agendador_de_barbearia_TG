import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, EstadoCarregamento, EstadoErro } from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { FormularioCadastro, estiloBotao, estiloCampo } from '../components/formulario-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import { buscarCliente, consultarClientes, excluirCliente, salvarCliente } from './services/clientes-api';

export function ClientesAdministrador() {
  const { usuario } = useAutenticacao(), cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_USUARIOS');
  const [busca, setBusca] = useState(''), [status, setStatus] = useState(''), [pagina, setPagina] = useState(1);
  const [editor, setEditor] = useState<{ id: number | null; dados: Record<string, string>; leitura: boolean } | null>(null);
  const [excluir, setExcluir] = useState<number | null>(null), [aviso, setAviso] = useState('');
  const consulta = useQuery({ queryKey: ['admin', usuario?.id, 'clientes', busca, status, pagina], enabled: permitido, queryFn: ({ signal }) => consultarClientes({ busca, status: status ? status as 'ATIVO' | 'INATIVO' | 'BLOQUEADO' : undefined, pagina }, signal) });
  const abrir = useMutation({ mutationFn: buscarCliente, onSuccess: (dados, id) => { setEditor({ id, dados, leitura: true }); setAviso(''); } });
  const gravar = useMutation({ mutationFn: (dados: Record<string, string>) => salvarCliente(editor!.id, dados), onSuccess: async () => { setEditor(null); setAviso('Cliente salvo.'); await cache.invalidateQueries(); } });
  const remover = useMutation({ mutationFn: excluirCliente, onSuccess: async () => { setExcluir(null); setAviso('Cliente excluído.'); setPagina(1); await cache.invalidateQueries(); } });
  const campos: CampoCadastro[] = [
    { nome: 'nome', rotulo: 'Nome', obrigatorio: true, tamanhoMinimo: 2 }, { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true },
    { nome: 'cpf', rotulo: 'CPF', obrigatorio: true }, { nome: 'telefone', rotulo: 'Telefone' }, { nome: 'dataNascimento', rotulo: 'Nascimento', tipo: 'date' }, { nome: 'observacao', rotulo: 'Observação' },
    ...(!editor?.leitura ? [{ nome: 'senha', rotulo: editor?.id ? 'Nova senha (opcional)' : 'Senha', tipo: 'password' as const, tamanhoMinimo: 15, obrigatorio: editor?.id === null }] : []),
    ...(editor?.id ? [{ nome: 'status', rotulo: 'Status', obrigatorio: true, opcoes: ['ATIVO', 'INATIVO', 'BLOQUEADO'].map(valor => ({ valor, rotulo: valor })) }] : []),
  ];
  const erro = gravar.error ?? remover.error ?? abrir.error;
  const data = (v: string | null) => v ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(v)) : '—';
  return <DashboardLayout titulo="Clientes" subtitulo="Consulte e gerencie os clientes cadastrados" itens={MENU_ADMINISTRADOR}>
    {!permitido ? <p role="alert">Você não possui permissão para gerenciar clientes.</p> : <>
      <div className="flex flex-wrap gap-3"><label>Buscar por nome, telefone ou e-mail<input className={estiloCampo} value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /></label><label>Status<select className={estiloCampo} value={status} onChange={e => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos</option>{['ATIVO', 'INATIVO', 'BLOQUEADO'].map(s => <option key={s}>{s}</option>)}</select></label><button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ id: null, dados: {}, leitura: false }); }}>Novo cliente</button></div>
      {aviso && <p role="status">{aviso}</p>}{erro && !editor && <p role="alert">{erro.message}</p>}
      {editor && <><FormularioCadastro key={`${editor.id}-${editor.leitura}`} campos={campos} valores={editor.dados} somenteLeitura={editor.leitura} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => setEditor(null)} />{editor.leitura && <button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ ...editor, leitura: false }); }}>Editar cliente</button>}</>}
      {excluir !== null && <div role="alertdialog" aria-label="Confirmar exclusão"><p>Excluir este cliente? Agendamentos vinculados impedem a exclusão. Para preservar o cadastro, edite o status.</p><button className={estiloBotao} disabled={remover.isPending} onClick={() => remover.mutate(excluir)}>Confirmar exclusão</button><button className={estiloBotao} disabled={remover.isPending} onClick={() => setExcluir(null)}>Cancelar</button></div>}
      {consulta.isPending ? <EstadoCarregamento /> : consulta.isError ? <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} /> : <>
        <p className="my-4">Clientes ativos: {consulta.data.ativos} · Novos no mês: {consulta.data.novosNoMes} · Retorno agendado: {consulta.data.retornoAgendado}</p>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr>{['Cliente', 'Telefone', 'E-mail', 'Último atendimento', 'Próximo horário', 'Status', 'Ações'].map(c => <th key={c} className="p-2">{c}</th>)}</tr></thead><tbody>{consulta.data.data.map(c => <tr key={c.id} className="border-t border-border"><td className="p-2">{c.nome}</td><td>{c.telefone}</td><td>{c.email}</td><td>{data(c.ultimoAtendimento)}</td><td>{data(c.proximoHorario)}</td><td>{c.status}</td><td><button className={estiloBotao} disabled={abrir.isPending} onClick={() => abrir.mutate(c.id)}>Visualizar {c.nome}</button><button className={estiloBotao} onClick={() => { remover.reset(); setExcluir(c.id); }}>Excluir {c.nome}</button></td></tr>)}</tbody></table></div>
        {!consulta.data.data.length && <p>Nenhum cliente encontrado.</p>}<nav aria-label="Paginação de clientes" className="my-4 flex gap-3"><button className={estiloBotao} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button><span>Página {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)} · {consulta.data.meta.total} clientes</span><button className={estiloBotao} disabled={pagina >= consulta.data.meta.totalPaginas} onClick={() => setPagina(pagina + 1)}>Próxima</button></nav>
      </>}
    </>}
  </DashboardLayout>;
}
