import { Button } from '@heroui/react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import type { AgendamentoControllerListarParams } from '../../../../api/models';
import { DashboardLayout, Cartao } from '../../components/dashboard-compartilhado';
import { nomeStatus } from '../../components/dashboard-formatadores';
import { dataHorario } from '../../../agendamento/formatadores';
import { EstadoConsulta } from '../../../agendamento/components/etapas-agendamento';
import { MENU_BARBEIRO } from '../menu-barbeiro';
import { listarAgenda } from './services/agenda-barbeiro-api';

const STATUS_AGENDA = ['PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU'] as const;
const hojeBrasilia = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' }).format(new Date());
const campo = 'mt-1 block w-full rounded-lg border border-border bg-surface p-2 focus-visible:outline-primary';
export function AgendaBarbeiro() {
  const { usuario } = useAutenticacao();
  const [params, definirParams] = useSearchParams();
  const pagina = Math.max(1, Number(params.get('pagina')) || 1);
  const de = params.get('de') ?? hojeBrasilia();
  const ate = params.get('ate') ?? de;
  const status = params.get('status') ?? '';
  const filtros: AgendamentoControllerListarParams = { pagina, limite: 10,
    inicioDe: `${de}T00:00:00-03:00`, inicioAte: `${ate}T23:59:59.999-03:00`,
    status: STATUS_AGENDA.find((item) => item === status) };
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_PROPRIA_AGENDA');
  const consulta = useQuery({ queryKey: ['agenda-barbeiro', usuario?.id, filtros],
    queryFn: ({ signal }) => listarAgenda(filtros, signal), enabled: permitido, retry: false });
  return <DashboardLayout titulo="Minha agenda" subtitulo="Horários no fuso de Brasília" itens={MENU_BARBEIRO}>
    {!permitido ? <p role="alert">Você não possui permissão para consultar a própria agenda.</p> : <>
      <form key={`${de}-${ate}-${status}`} onSubmit={(e) => {
        e.preventDefault(); const dados = new FormData(e.currentTarget);
        definirParams({ de: String(dados.get('de')), ate: String(dados.get('ate')), status: String(dados.get('status')), pagina: '1' });
      }} className="mb-5 flex flex-wrap items-end gap-3">
        <label>De<input name="de" type="date" required defaultValue={de} className={campo} /></label>
        <label>Até<input name="ate" type="date" required min={de} defaultValue={ate} className={campo} /></label>
        <label>Situação<select name="status" defaultValue={status} className={campo}><option value="">Todas</option>{STATUS_AGENDA.map((s) => <option key={s} value={s}>{nomeStatus(s)}</option>)}</select></label>
        <Button type="submit">Aplicar filtros</Button><Button variant="secondary" onPress={() => definirParams({ de: hojeBrasilia(), ate: hojeBrasilia() })}>Hoje</Button>
      </form>
      <EstadoConsulta carregando={consulta.isPending} erro={consulta.error} vazio={!consulta.data?.data.length} tentar={() => void consulta.refetch()}>
        <div className="space-y-3">{consulta.data?.data.map((item) => <Cartao key={item.id}>
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-semibold">{item.cliente.nome}</h2><p>{dataHorario(item.inicioPrevisto)} · {nomeStatus(item.status)}</p><p className="text-sm text-muted">{item.filial.nome} · {item.servicos.map((s) => s.servico.nome).join(', ')}</p></div>
            <Link className="rounded-lg border border-border px-4 py-2 text-primary focus-visible:outline-primary" to={`/barbeiro/agenda/${item.id}`} state={{ retorno: `/barbeiro/agenda?${params}` }}>Visualizar #{item.id}</Link></div>
        </Cartao>)}</div>
      </EstadoConsulta>
      {consulta.data && <nav aria-label="Paginação da agenda" className="mt-5 flex items-center justify-between gap-3">
        <Button variant="secondary" isDisabled={pagina <= 1} onPress={() => { const novos = new URLSearchParams(params); novos.set('pagina', String(pagina - 1)); definirParams(novos); }}>Anterior</Button>
        <span>{consulta.data.meta.total} agendamentos · Página {pagina} de {Math.max(1, consulta.data.meta.totalPaginas)}</span>
        <Button variant="secondary" isDisabled={pagina >= consulta.data.meta.totalPaginas} onPress={() => { const novos = new URLSearchParams(params); novos.set('pagina', String(pagina + 1)); definirParams(novos); }}>Próxima</Button>
      </nav>}
    </>}
  </DashboardLayout>;
}
