import { nomeStatus } from "../../../components/dashboard-formatadores";
import { Icone } from "../../../components/dashboard-compartilhado";
import {
  celulasMes,
  formatarDia,
  formatarPeriodo,
  hojeBarbearia,
} from "../calendario";
import type { DiaAgenda, VisualizacaoAgenda } from "../types";

const hora = (valor: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(valor));
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const STATUS = [
  ["CONFIRMADO", "Confirmados"],
  ["PENDENTE", "Pendentes"],
  ["EM_ATENDIMENTO", "Em atendimento"],
  ["CONCLUIDO", "Concluídos"],
  ["CANCELADO", "Cancelados"],
  ["NAO_COMPARECEU", "Não compareceram"],
] as const;
const botao = "agenda-botao";

export function GradeSemanal({
  dias,
  selecionado,
  selecionarDia,
  visualizacao,
}: {
  dias: DiaAgenda[];
  selecionado: string;
  selecionarDia: (data: string) => void;
  visualizacao: VisualizacaoAgenda;
}) {
  const mensal = visualizacao === "Mês";
  const vazio = !dias.some((dia) => dia.agendamentos.length);
  const celulas = mensal ? celulasMes(dias) : dias;
  const hoje = hojeBarbearia();
  const estadoVazio = (
    <div className="rounded-xl border border-border bg-surface p-5 text-center shadow-sm">
      <Icone nome="agenda" className="mx-auto mb-2 size-5 text-primary" />
      <h2 className="text-sm font-semibold text-foreground">
        Nenhum agendamento neste período.
      </h2>
      <p className="mt-2 text-xs leading-relaxed text-foreground">
        Os atendimentos aparecerão aqui, organizados por dia e horário.
      </p>
    </div>
  );
  return (
    <div
      className="agenda-calendario"
      aria-label={`Calendário: ${visualizacao}`}
    >
      <div
        className="agenda-rolagem"
        tabIndex={0}
        aria-label="Grade de agendamentos"
      >
        <div
          className={`agenda-grade agenda-grade-${mensal ? "mes" : visualizacao === "Dia" ? "dia" : "semana"}`}
        >
          {mensal &&
            DIAS.map((dia) => (
              <div key={dia} className="agenda-dia-semana">
                {dia}
              </div>
            ))}
          {vazio && mensal && (
            <div className="agenda-vazio-mensal" role="status">
              {estadoVazio}
            </div>
          )}
          {celulas.map((dia, indice) =>
            dia ? (
              <section
                key={dia.data}
                className={`agenda-dia ${selecionado === dia.data ? "agenda-dia-selecionado" : ""}`}
              >
                <header>
                  <button
                    type="button"
                    className="agenda-selecionar"
                    aria-label={formatarDia(dia.data, true)}
                    aria-pressed={selecionado === dia.data}
                    aria-current={hoje === dia.data ? "date" : undefined}
                    onClick={() => selecionarDia(dia.data)}
                  >
                    {!mensal && (
                      <span className="text-xs">
                        {
                          DIAS[
                            (new Date(`${dia.data}T12:00:00Z`).getUTCDay() +
                              6) %
                              7
                          ]
                        }
                      </span>
                    )}
                    <span
                      className={`agenda-data ${hoje === dia.data ? "agenda-hoje" : ""}`}
                    >
                      {dia.data.slice(8)}
                    </span>
                    <span className="sr-only">{formatarDia(dia.data)}</span>
                  </button>
                </header>
                <div className="space-y-2 p-2">
                  {dia.agendamentos.map((item) => (
                    <article key={item.id} className="agenda-agendamento">
                      <strong>{hora(item.inicio)}</strong>
                      <p className="font-semibold">{item.cliente}</p>
                      <p>{item.servicos.join(" + ")}</p>
                      <p>{item.barbeiro}</p>
                      <p className="mt-1 font-medium text-primary">
                        {item.status === "CONCLUIDO"
                          ? "Concluído"
                          : item.status === "NAO_COMPARECEU"
                            ? "Não compareceu"
                            : nomeStatus(item.status)}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            ) : (
              <div
                key={`espaco-${indice}`}
                className="agenda-espaco"
                aria-hidden="true"
              />
            ),
          )}
        </div>
      </div>
      {vazio && !mensal && (
        <div className="agenda-vazio" role="status">
          {estadoVazio}
        </div>
      )}
    </div>
  );
}

export function ResumoAgenda({ dia }: { dia: DiaAgenda }) {
  return (
    <aside className="agenda-resumo" aria-label="Resumo do dia selecionado">
      <h2 className="font-serif text-lg font-bold text-foreground">
        Resumo do dia
      </h2>
      <p className="mt-1 text-xs capitalize text-foreground">
        {formatarDia(dia.data, true)}
      </p>
      <dl className="my-4 divide-y divide-border">
        {STATUS.map(([status, rotulo]) => (
          <div
            key={status}
            className="flex justify-between gap-2 py-2.5 text-xs"
          >
            <dt>{rotulo}</dt>
            <dd className="font-semibold tabular-nums">
              {dia.agendamentos.filter((item) => item.status === status).length}
            </dd>
          </div>
        ))}
      </dl>
      <h3 className="border-t border-border pt-4 text-sm font-semibold">
        Agendamentos do dia
      </h3>
      {!dia.agendamentos.length && (
        <p className="mt-3 rounded-lg border border-dashed border-border p-4 text-center text-xs">
          Nenhum agendamento neste dia.
        </p>
      )}
      <ul className="mt-2 divide-y divide-border">
        {dia.agendamentos.map((item) => (
          <li key={item.id} className="py-3 text-xs leading-relaxed">
            <strong>
              {hora(item.inicio)} · {item.cliente}
            </strong>
            <p>{item.servicos.join(" + ")}</p>
            <p>{item.barbeiro}</p>
            <p className="font-medium text-primary">
              {item.status === "CONCLUIDO"
                ? "Concluído"
                : item.status === "NAO_COMPARECEU"
                  ? "Não compareceu"
                  : nomeStatus(item.status)}
            </p>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ControlesAgenda({
  inicioDe,
  inicioAte,
  visualizacao,
  mudarVisualizacao,
  mover,
  hoje,
}: {
  inicioDe: string;
  inicioAte: string;
  visualizacao: VisualizacaoAgenda;
  mudarVisualizacao: (valor: VisualizacaoAgenda) => void;
  mover: (direcao: number) => void;
  hoje: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
      <nav aria-label="Período da agenda" className="flex items-center gap-1">
        <button type="button" className={botao} onClick={hoje}>
          Hoje
        </button>
        <button
          type="button"
          className={botao}
          aria-label="Período anterior"
          onClick={() => mover(-1)}
        >
          ‹
        </button>
        <button
          type="button"
          className={botao}
          aria-label="Próximo período"
          onClick={() => mover(1)}
        >
          ›
        </button>
      </nav>
      <span className="text-sm font-medium" aria-live="polite">
        {formatarPeriodo(inicioDe, inicioAte)}
      </span>
      <div
        className="ml-auto flex shrink-0 gap-1 rounded-lg border border-border bg-background p-1"
        role="group"
        aria-label="Visualização da agenda"
      >
        {(["Dia", "Semana", "Mês"] as const).map((valor) => (
          <button
            type="button"
            key={valor}
            className={botao}
            aria-pressed={valor === visualizacao}
            onClick={() => mudarVisualizacao(valor)}
          >
            {valor}
          </button>
        ))}
      </div>
    </div>
  );
}
