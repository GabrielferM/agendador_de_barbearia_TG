import { BadgeStatus } from "../../components/componentes-administrativos";
import { estiloBotao } from "../../components/formulario-cadastro";
import { nomeStatus } from "../../../components/dashboard-formatadores";
import { formatarDia } from "../calendario";
import type { DiaAgenda, VisualizacaoAgenda } from "../types";

const hora = (valor: string) => new Intl.DateTimeFormat("pt-BR", {
  timeZone: "America/Sao_Paulo", hour: "2-digit", minute: "2-digit",
}).format(new Date(valor));

export function GradeSemanal({ dias, selecionado, selecionarDia, visualizacao }: {
  dias: DiaAgenda[]; selecionado: string; selecionarDia: (data: string) => void; visualizacao: VisualizacaoAgenda;
}) {
  const colunas = visualizacao === "Dia" ? "grid-cols-1" : "min-w-[920px] grid-cols-7";
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <div className={`grid ${colunas}`}>
        {dias.map((dia) => (
          <section key={dia.data} className="border-b border-r border-border">
            <header className="border-b border-border p-2 text-center">
              <button className={`${estiloBotao} w-full ${selecionado === dia.data ? "bg-background font-bold" : ""}`}
                aria-label={formatarDia(dia.data, true)} aria-pressed={selecionado === dia.data} onClick={() => selecionarDia(dia.data)}>
                <span className="block">{dia.rotulo}</span>
                <span className="text-xs text-muted">{formatarDia(dia.data)}</span>
              </button>
            </header>
            <div className="space-y-3 p-2">
              {!dia.agendamentos.length && <p className="p-2 text-xs text-muted">Sem agendamentos</p>}
              {dia.agendamentos.map((item) => (
                <article key={item.id} className="rounded-lg border-l-4 border-secondary bg-background p-3 text-xs">
                  <strong>{hora(item.inicio)}</strong>
                  <p className="mt-1 font-semibold">{item.cliente}</p>
                  <p className="mt-1 text-muted">{item.servicos.join(" + ")}</p>
                  <p className="text-muted">{item.barbeiro}</p>
                  <p className="mt-1">{nomeStatus(item.status)}</p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

export function ResumoAgenda({ dia }: { dia: DiaAgenda }) {
  const contar = (status: string) => dia.agendamentos.filter(item => item.status === status).length;
  return (
    <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <h2 className="font-serif text-xl font-bold">Resumo do dia</h2>
      <p className="text-sm text-muted">{formatarDia(dia.data, true)}</p>
      <dl className="my-5 space-y-2">
        {[
          ["Confirmados", contar("CONFIRMADO")], ["Pendentes", contar("PENDENTE")],
          ["Em atendimento", contar("EM_ATENDIMENTO")], ["Concluídos", contar("CONCLUIDO")],
          ["Cancelados", contar("CANCELADO")], ["Não compareceram", contar("NAO_COMPARECEU")],
        ].map(([rotulo, valor]) => (
          <div key={rotulo} className="flex justify-between rounded-lg bg-background p-3 text-sm">
            <dt>{rotulo}</dt><dd className="font-bold">{valor}</dd>
          </div>
        ))}
      </dl>
      <h3 className="border-t border-border pt-4 font-semibold">Agendamentos do dia selecionado</h3>
      {!dia.agendamentos.length && <p className="mt-3 text-sm text-muted">Nenhum agendamento neste dia.</p>}
      <ul className="mt-2 divide-y divide-border">
        {dia.agendamentos.map((item) => (
          <li key={item.id} className="flex items-center justify-between gap-2 py-3 text-xs">
            <div><strong>{hora(item.inicio)} · {item.cliente}</strong><p className="text-muted">{item.servicos.join(" + ")}</p></div>
            <BadgeStatus alerta={item.status === "PENDENTE"}>{nomeStatus(item.status)}</BadgeStatus>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ControlesAgenda({ inicioDe, inicioAte, visualizacao, mudarVisualizacao, mover, hoje }: {
  inicioDe: string; inicioAte: string; visualizacao: VisualizacaoAgenda;
  mudarVisualizacao: (valor: VisualizacaoAgenda) => void; mover: (direcao: number) => void; hoje: () => void;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <button className={estiloBotao} onClick={hoje}>Hoje</button>
      <nav aria-label="Período da agenda" className="flex items-center gap-2">
        <button className={estiloBotao} aria-label="Período anterior" onClick={() => mover(-1)}>‹</button>
        <span>{formatarDia(inicioDe, true)} — {formatarDia(inicioAte, true)}</span>
        <button className={estiloBotao} aria-label="Próximo período" onClick={() => mover(1)}>›</button>
      </nav>
      <div className="flex gap-2" role="group" aria-label="Visualização da agenda">
        {(["Dia", "Semana", "Mês"] as const).map(valor => (
          <button key={valor} className={estiloBotao} aria-pressed={valor === visualizacao}
            onClick={() => mudarVisualizacao(valor)}>{valor}</button>
        ))}
      </div>
    </div>
  );
}
