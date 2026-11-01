import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import { DashboardLayout, EstadoErro } from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { ControlesAgenda, GradeSemanal, ResumoAgenda } from "./components/components";
import { consultarAgenda, ErroAgenda } from "./services/agendamentos-api";
import { hojeBarbearia, moverPeriodo, periodoAgenda, formatarPeriodo } from "./calendario";
import "./agenda.css";
import type { DiaAgenda, VisualizacaoAgenda } from "./types";

export function AgendamentosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_AGENDAMENTOS");
  const [data, selecionarDia] = useState(hojeBarbearia);
  const [visualizacao, mudarVisualizacao] = useState<VisualizacaoAgenda>("Semana");
  const { inicioDe, inicioAte } = periodoAgenda(data, visualizacao);
  const consulta = useQuery<DiaAgenda[]>({
    queryKey: ["admin", usuario?.id, "agendamentos", inicioDe, inicioAte],
    enabled: permitido,
    staleTime: 60_000,
    retry: (tentativas, erro) => !(erro instanceof ErroAgenda && erro.status >= 400 && erro.status < 500) && tentativas < 1,
    refetchOnWindowFocus: query => query.state.status !== "error",
    refetchOnReconnect: query => query.state.status !== "error",
    retryOnMount: false,
    queryFn: ({ signal }) => consultarAgenda(inicioDe, inicioAte, signal),
  });
  const dia = consulta.data?.find(dia => dia.data === data);
  return (
    <DashboardLayout titulo="Agendamentos" subtitulo="Consulte a agenda da barbearia" itens={MENU_ADMINISTRADOR}>
      {!permitido ? <p role="alert">Você não possui permissão para consultar agendamentos.</p> : <section aria-label="Agenda administrativa" className="agenda-painel">
        <ControlesAgenda inicioDe={inicioDe} inicioAte={inicioAte} visualizacao={visualizacao}
          mudarVisualizacao={mudarVisualizacao} hoje={() => selecionarDia(hojeBarbearia())}
          mover={direcao => selecionarDia(moverPeriodo(data, visualizacao, direcao))} />
        {consulta.isPending ? <div role="status" className="grid min-h-96 place-items-center">Carregando agenda…</div> : consulta.isError ? (
          <EstadoErro mensagem={consulta.error.message} esperarAte={consulta.error instanceof ErroAgenda ? consulta.error.esperarAte : undefined} tentarNovamente={() => void consulta.refetch()} />
        ) : <>
          <div className="agenda-conteudo">
            <GradeSemanal dias={consulta.data} selecionado={data} selecionarDia={selecionarDia} visualizacao={visualizacao} />
            {dia && <ResumoAgenda dia={dia} />}
          </div>
          <footer className="flex flex-wrap justify-between gap-2 border-t border-border px-4 py-3 text-xs text-foreground">
            <span>{consulta.data.reduce((total, dia) => total + dia.agendamentos.length, 0)} agendamentos {visualizacao === "Dia" ? "no dia" : visualizacao === "Semana" ? "na semana" : "no mês"}</span>
            <span>{formatarPeriodo(inicioDe, inicioAte)}</span>
          </footer>
        </>}
      </section>}
    </DashboardLayout>
  );
}
