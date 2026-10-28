import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import { DashboardLayout, EstadoCarregamento, EstadoErro } from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { ControlesAgenda, GradeSemanal, ResumoAgenda } from "./components/components";
import { consultarAgenda } from "./services/agendamentos-api";
import { hojeBarbearia, moverPeriodo, periodoAgenda } from "./calendario";
import { GestaoAgenda } from "./components/gestao-agenda";
import type { VisualizacaoAgenda } from "./types";

export function AgendamentosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_AGENDAMENTOS");
  const [data, selecionarDia] = useState(hojeBarbearia);
  const [visualizacao, mudarVisualizacao] = useState<VisualizacaoAgenda>("Semana");
  const [filtros, alterarFiltros] = useState({ idCliente: "", idBarbeiro: "", status: "" });
  const { inicioDe, inicioAte } = periodoAgenda(data, visualizacao);
  const consulta = useQuery({
    queryKey: ["admin", usuario?.id, "agendamentos", inicioDe, inicioAte, filtros],
    enabled: permitido,
    queryFn: ({ signal }) => consultarAgenda(inicioDe, inicioAte, signal, filtros),
  });
  const dia = consulta.data?.find(dia => dia.data === data);
  return (
    <DashboardLayout titulo="Agendamentos" subtitulo="Consulte a agenda da barbearia" itens={MENU_ADMINISTRADOR}>
      {!permitido ? <p role="alert">Você não possui permissão para consultar agendamentos.</p> : <>
        <GestaoAgenda dias={consulta.data ?? []} filtros={filtros} alterarFiltros={alterarFiltros} />
        <ControlesAgenda inicioDe={inicioDe} inicioAte={inicioAte} visualizacao={visualizacao}
          mudarVisualizacao={mudarVisualizacao} hoje={() => selecionarDia(hojeBarbearia())}
          mover={direcao => selecionarDia(moverPeriodo(data, visualizacao, direcao))} />
        {consulta.isPending ? <EstadoCarregamento /> : consulta.isError ? (
          <EstadoErro mensagem={consulta.error.message} tentarNovamente={() => void consulta.refetch()} />
        ) : <>
          {!consulta.data.some(dia => dia.agendamentos.length) && <p role="status" className="mb-4">Nenhum agendamento neste período.</p>}
          <div className="grid gap-4 xl:grid-cols-[1fr_340px]">
            <GradeSemanal dias={consulta.data} selecionado={data} selecionarDia={selecionarDia} visualizacao={visualizacao} />
            {dia && <ResumoAgenda dia={dia} />}
          </div>
        </>}
      </>}
    </DashboardLayout>
  );
}
