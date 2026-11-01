import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, EstadoCarregamento, EstadoErro } from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { FormularioCadastro, estiloBotao, estiloCampo } from '../components/formulario-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import { buscarCliente, consultarClientes, excluirCliente, salvarCliente } from './services/clientes-api';

import { PainelCatalogo, FaixaIndicadores, PaginacaoCatalogo, ConfirmacaoExclusao } from '../components/painel-catalogo';
import { BadgeStatus } from '../components/componentes-administrativos';

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
  const erro = gravar.error ?? (excluir === null ? remover.error : null) ?? abrir.error;
  const data = (v: string | null) => v ? new Intl.DateTimeFormat('pt-BR', { timeZone: 'America/Sao_Paulo', dateStyle: 'short', timeStyle: 'short' }).format(new Date(v)) : '—';
  return <DashboardLayout titulo="Clientes" subtitulo="Consulte e gerencie os clientes cadastrados" itens={MENU_ADMINISTRADOR}>
    {!permitido ? <p role="alert">Você não possui permissão para gerenciar clientes.</p> : <PainelCatalogo>
      {consulta.data && !consulta.isError && <FaixaIndicadores itens={[
        { titulo: 'Clientes ativos', valor: String(consulta.data.ativos) },
        { titulo: 'Novos no mês', valor: String(consulta.data.novosNoMes) },
        { titulo: 'Retorno agendado', valor: String(consulta.data.retornoAgendado) },
      ]} />}
      <div className="filtros-catalogo"><label>Buscar por nome, telefone ou e-mail<input placeholder="Nome, telefone ou e-mail" className={estiloCampo} value={busca} onChange={e => { setBusca(e.target.value); setPagina(1); }} /></label><label>Status<select className={estiloCampo} value={status} onChange={e => { setStatus(e.target.value); setPagina(1); }}><option value="">Todos</option>{['ATIVO', 'INATIVO', 'BLOQUEADO'].map(s => <option key={s}>{s}</option>)}</select></label><button className={`${estiloBotao} bg-primary! text-white sm:ml-auto`} onClick={() => { gravar.reset(); setEditor({ id: null, dados: {}, leitura: false }); }}>Novo cliente</button></div>
      {aviso && <p role="status">{aviso}</p>}{erro && !editor && <p role="alert">{erro.message}</p>}
      <div className="px-4">{editor && <><FormularioCadastro key={`${editor.id}-${editor.leitura}`} campos={campos} valores={editor.dados} somenteLeitura={editor.leitura} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => setEditor(null)} />{editor.leitura && <button className={estiloBotao} onClick={() => { gravar.reset(); setEditor({ ...editor, leitura: false }); }}>Editar cliente</button>}</>}
      {excluir !== null && <ConfirmacaoExclusao pendente={remover.isPending} fechar={() => setExcluir(null)}><h2 className="mb-2 font-semibold">Excluir cliente?</h2><p className="mb-4 text-sm">Excluir {consulta.data?.data.find(c => c.id === excluir)?.nome ?? "este cliente"}? Agendamentos vinculados impedem a exclusão. Para preservar o cadastro, edite o status.</p><button className={estiloBotao} disabled={remover.isPending} onClick={() => remover.mutate(excluir)}>Confirmar exclusão</button><button data-foco-inicial className={estiloBotao} disabled={remover.isPending} onClick={() => setExcluir(null)}>Cancelar</button>{remover.error && <p className="mt-3 text-danger" role="alert">{remover.error.message}</p>}</ConfirmacaoExclusao>}</div>
      {consulta.isPending ? <EstadoCarregamento /> : consulta.isError ? <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} /> : <>
        <div className="min-w-0 px-4 pb-4"><div className="overflow-x-auto" role="region" aria-label="Lista de clientes" tabIndex={0}><table className="min-w-[850px] text-left"><caption className="sr-only">Clientes cadastrados</caption><thead><tr>{['Cliente', 'Contato', 'Último atendimento', 'Próximo horário', 'Status', 'Ações'].map(c => <th scope="col" key={c}>{c}</th>)}</tr></thead><tbody>{consulta.data.data.map(c => <tr key={c.id}>
          <td><div className="flex items-center gap-2"><span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-background font-semibold text-primary">{c.nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('')}</span><span className="min-w-32 max-w-56 font-semibold">{c.nome || '—'}</span></div></td>
          <td><div className="min-w-40 max-w-64">{c.telefone || '—'}<span className="block">{c.email || '—'}</span></div></td><td>{data(c.ultimoAtendimento)}</td><td>{data(c.proximoHorario)}</td><td><BadgeStatus negativo={c.status === 'BLOQUEADO'} alerta={c.status === 'INATIVO'}>{c.status === 'ATIVO' ? 'Ativo' : c.status === 'INATIVO' ? 'Inativo' : 'Bloqueado'}</BadgeStatus></td>
          <td><div className="flex items-center gap-2"><button className={estiloBotao} aria-label={`Visualizar ${c.nome}`} disabled={abrir.isPending} onClick={() => abrir.mutate(c.id)}>Visualizar</button><button className={`${estiloBotao} text-danger`} aria-label={`Excluir ${c.nome}`} onClick={() => { remover.reset(); setExcluir(c.id); }}><svg aria-hidden="true" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></svg></button></div></td>
        </tr>)}</tbody></table></div>{!consulta.data.data.length && <p className="py-10 text-center text-sm">Nenhum cliente encontrado.</p>}</div>
        <PaginacaoCatalogo pagina={pagina} totalPaginas={consulta.data.meta.totalPaginas} total={consulta.data.meta.total} entidade="clientes" mudar={setPagina} />
      </>}
    </PainelCatalogo>}
  </DashboardLayout>;
}
