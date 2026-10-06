import { AcoesAtendimento } from "./components/acoes-atendimento";
import { useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import { DashboardLayout, Cartao } from '../../components/dashboard-compartilhado';
import { nomeStatus } from '../../components/dashboard-formatadores';
import { moeda } from '../../../agendamento/formatadores';
import { ResumoAgendamento } from '../../../agendamento/components/resumo-agendamento';
import { EstadoConsulta } from '../../../agendamento/components/etapas-agendamento';
import { MENU_BARBEIRO } from '../menu-barbeiro';
import { buscarAtendimento } from './services/agenda-barbeiro-api';
export function DetalheAtendimento() {
  const { usuario } = useAutenticacao(); const { id } = useParams(); const location = useLocation();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_PROPRIA_AGENDA');
  const consulta = useQuery({ queryKey: ['atendimento', usuario?.id, Number(id)],
    queryFn: ({ signal }) => buscarAtendimento(Number(id), signal), enabled: permitido && Number.isInteger(Number(id)) && Number(id) > 0, retry: false });
  const retorno = typeof location.state?.retorno === 'string' && location.state.retorno.startsWith('/barbeiro/') ? location.state.retorno : '/barbeiro/agenda';
  return <DashboardLayout titulo={`Atendimento #${id}`} subtitulo="Detalhes do agendamento" itens={MENU_BARBEIRO}>
    <Link to={retorno} className="mb-5 inline-block text-primary underline">Voltar à lista</Link>
    {!permitido ? <p role="alert">Você não possui permissão para consultar a própria agenda.</p> : <EstadoConsulta carregando={consulta.isPending} erro={consulta.error} vazio={!consulta.data} tentar={() => void consulta.refetch()}>
      {consulta.data && <Cartao titulo={`${consulta.data.cliente.nome} · ${nomeStatus(consulta.data.status)}`}>
        <ResumoAgendamento item={consulta.data} />
        <AcoesAtendimento item={consulta.data} />
        <ul className="mt-5 divide-y divide-border">{consulta.data.servicos.map((s) => <li key={s.idServico} className="py-3 text-sm">{s.servico.nome} · {s.quantidade}× {moeda(Number(s.precoAplicado))} · {s.duracaoAplicadaMinutos} min por unidade · Subtotal {moeda(Number(s.subtotal))}</li>)}</ul>
        {consulta.data.motivoCancelamento && <p>Motivo do cancelamento: {consulta.data.motivoCancelamento}</p>}
      </Cartao>}
    </EstadoConsulta>}
  </DashboardLayout>;
}
