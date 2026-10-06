import { usarDadosMockados } from "../../mocks/dados-dashboard";
import { servicosMock } from "./mock/dados-mock";
import { FormularioCadastro, ConfirmarExclusao, type CampoCadastro } from "../components/formulario-cadastro";
import { Button } from '@heroui/react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, Cartao, Kpi } from '../../components/dashboard-compartilhado';
import { moeda } from '../../components/dashboard-formatadores';
import { EstadoConsulta } from '../../../agendamento/components/etapas-agendamento';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { DialogoOperacao, PaginacaoCadastros } from '../components/dialogo-operacao';
import { texto } from '../services/operacoes-api';
import { listarServicos, buscarServico, salvarServico, excluirServico } from './services/servicos-api';
function ServicosIntegrados() {
  const { usuario } = useAutenticacao(); const [pagina, definirPagina] = useState(1); const [filtros, definirFiltros] = useState({ busca: '', ativo: '' }); const [id, definirId] = useState<number | null>(null);
  const cache = useQueryClient(); const [modo, definirModo] = useState<'novo' | 'editar' | 'excluir' | null>(null);
  async function salvo() { definirModo(null); definirId(null); await Promise.all(['admin-servicos', 'admin-servico', 'dashboard', 'agendar'].map((key) => cache.invalidateQueries({ queryKey: [key] }))); }
  const campos: CampoCadastro[] = [{ nome: 'nome', rotulo: 'Nome', obrigatorio: true, minimo: 2 }, { nome: 'descricao', rotulo: 'Descrição', tipo: 'textarea' }, { nome: 'precoBase', rotulo: 'Preço base (R$)', tipo: 'number', minimo: 0.01, passo: '0.01', obrigatorio: true }, { nome: 'duracaoMinutos', rotulo: 'Duração em minutos', tipo: 'number', minimo: 1, passo: '1', obrigatorio: true }, ...(modo === 'editar' ? [{ nome: 'ativo', rotulo: 'Situação (afeta novas reservas)', tipo: 'boolean' as const, obrigatorio: true, opcoes: [{ valor: 'true', rotulo: 'Ativo' }, { valor: 'false', rotulo: 'Inativo' }] }] : [])];
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_SERVICOS');
  const consulta = useQuery({ queryKey: ['admin-servicos', usuario?.id, pagina, filtros], queryFn: ({ signal }) => listarServicos({ pagina, ...filtros }, signal), enabled: permitido, retry: false });
  const detalhe = useQuery({ queryKey: ['admin-servico', usuario?.id, id], queryFn: ({ signal }) => buscarServico(id!, signal), enabled: permitido && id !== null, retry: false });
  return <DashboardLayout titulo="Serviços" subtitulo="Catálogo e resultados do mês" itens={MENU_ADMINISTRADOR}>
    {!permitido ? <p role="alert">Você não possui permissão para gerenciar serviços.</p> : <>
      {consulta.data && <div className="mb-5 grid gap-3 sm:grid-cols-3"><Kpi rotulo="Serviços ativos" valor={String(consulta.data.indicadores?.ativos)} detalhe="Catálogo atual" icone="servicos" /><Kpi rotulo="Mais realizado" valor={texto(consulta.data.indicadores?.maisRealizado) || 'Sem atendimento'} detalhe="Mês atual" icone="servicos" /><Kpi rotulo="Ticket médio" valor={moeda.format(Number(consulta.data.indicadores?.ticketMedio))} detalhe="Atendimentos concluídos" icone="financeiro" /></div>}
      <Button className="mb-4" onPress={() => { definirId(null); definirModo("novo"); }}>Novo serviço</Button>
      <form onSubmit={(e) => { e.preventDefault(); const dados = new FormData(e.currentTarget); definirFiltros({ busca: String(dados.get('busca')), ativo: String(dados.get('ativo')) }); definirPagina(1); }} className="mb-5 flex flex-wrap items-end gap-3"><label>Buscar serviço<input name="busca" className="block rounded-lg border border-border bg-surface p-2" /></label><label>Situação<select name="ativo" className="block rounded-lg border border-border bg-surface p-2"><option value="">Todas</option><option value="true">Ativo</option><option value="false">Inativo</option></select></label><Button type="submit">Buscar</Button><Button type="reset" variant="secondary" onPress={() => { definirFiltros({ busca: '', ativo: '' }); definirPagina(1); }}>Limpar</Button></form>
      <EstadoConsulta carregando={consulta.isPending} erro={consulta.error} vazio={!consulta.data?.data.length} tentar={() => void consulta.refetch()}><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{consulta.data?.data.map((item) => <Cartao key={Number(item.id)} titulo={texto(item.nome)}><p>{moeda.format(Number(item.preco))} · {String(item.duracaoMinutos)} min · {item.ativo ? 'Ativo' : 'Inativo'}</p><p className="my-3 text-sm text-muted">{String(item.realizadosMes)} ocorrências no mês · Receita {moeda.format(Number(item.receitaMes))}</p><Button variant="secondary" onPress={() => definirId(Number(item.id))}>Visualizar #{String(item.id)}</Button></Cartao>)}</div></EstadoConsulta>
      {consulta.data && <PaginacaoCadastros {...consulta.data.meta} pagina={pagina} mudar={definirPagina} />}
      <DialogoOperacao titulo={`Serviço #${id}`} aberto={id !== null && modo === null} fechar={() => definirId(null)}><EstadoConsulta carregando={detalhe.isPending} erro={detalhe.error} vazio={!detalhe.data} tentar={() => void detalhe.refetch()}>{detalhe.data && <dl className="space-y-3"><div><dt>Nome</dt><dd>{texto(detalhe.data.nome)}</dd></div><div><dt>Descrição</dt><dd>{texto(detalhe.data.descricao) || 'Não informada'}</dd></div><div><dt>Preço base</dt><dd>{moeda.format(Number(detalhe.data.precoBase))}</dd></div><div><dt>Duração</dt><dd>{String(detalhe.data.duracaoMinutos)} min</dd></div><div><dt>Situação</dt><dd>{detalhe.data.ativo ? 'Ativo' : 'Inativo'}</dd></div></dl>}</EstadoConsulta>{detalhe.data && <div className="mt-5 flex gap-3"><Button variant="secondary" onPress={() => definirModo("editar")}>Editar / alterar situação</Button><Button variant="secondary" onPress={() => definirModo("excluir")}>Excluir</Button></div>}</DialogoOperacao>
      {(modo === "novo" || (modo === "editar" && detalhe.data)) && <FormularioCadastro titulo={modo === "novo" ? "Novo serviço" : "Editar serviço"} campos={campos} inicial={modo === "editar" ? detalhe.data : {}} salvar={(dados) => salvarServico(modo === "novo" ? null : id, dados)} salvo={salvo} fechar={() => definirModo(null)} />}
      {modo === "excluir" && id !== null && detalhe.data && <ConfirmarExclusao nome={texto(detalhe.data.nome)} excluir={() => excluirServico(id)} salvo={salvo} fechar={() => definirModo(null)} />}
    </>}
  </DashboardLayout>;
}

export function ServicosAdministrador() {
  if (usarDadosMockados()) return <DashboardLayout titulo="Serviços" subtitulo="Exemplo do catálogo" itens={MENU_ADMINISTRADOR} dadosDemonstrativos><Cartao titulo="Catálogo de serviços"><ul className="space-y-3">{servicosMock.map((item) => <li key={item.id}>{item.nome} · {moeda.format(item.preco)} · {item.duracaoMinutos} min</li>)}</ul><p className="mt-4 text-sm text-muted">Gravações disponíveis no modo integrado.</p></Cartao></DashboardLayout>;
  return <ServicosIntegrados />;
}
