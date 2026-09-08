import {
  BadgeStatus,
  BotaoIndisponivel,
} from "../../components/componentes-administrativos";
import { hora } from "../../../components/dashboard-formatadores";
import type { DiaAgenda } from "../types";

export function GradeSemanal({ dias }: { dias: DiaAgenda[] }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-sm">
      <div className="grid min-w-[920px] grid-cols-6 divide-x divide-border">
        {dias.map((dia) => (
          <section key={dia.data} className="min-h-[560px]">
            <header className="border-b border-border p-3 text-center">
              <h2 className="font-semibold">{dia.rotulo}</h2>
              <p className="text-xs text-muted">{dia.data.slice(8, 10)}/09</p>
            </header>
            <div className="space-y-5 p-2">
              {dia.agendamentos.map((item) => (
                <article
                  key={item.id}
                  className="rounded-lg border-l-4 border-secondary bg-background p-3 text-xs"
                >
                  <strong>{hora(item.inicio)}</strong>
                  <p className="mt-1 font-semibold">{item.cliente}</p>
                  <p className="mt-1 text-muted">{item.servico}</p>
                  <p className="text-muted">{item.barbeiro}</p>
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
  const contar = (status: string) =>
    dia.agendamentos.filter((item) => item.status === status).length;
  return (
    <aside className="rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <h2 className="font-serif text-xl font-bold">Resumo do dia</h2>
      <p className="text-sm text-muted">
        Segunda-feira, 07 de setembro de 2026
      </p>
      <dl className="my-5 space-y-2">
        {[
          ["Confirmados", contar("CONFIRMADO")],
          ["Pendentes", contar("PENDENTE")],
          ["Em atendimento", contar("EM_ATENDIMENTO")],
          ["Concluídos", 0],
          ["Cancelados", 0],
        ].map(([rotulo, valor]) => (
          <div
            key={rotulo}
            className="flex justify-between rounded-lg bg-background p-3 text-sm"
          >
            <dt>{rotulo}</dt>
            <dd className="font-bold">{valor}</dd>
          </div>
        ))}
      </dl>
      <h3 className="border-t border-border pt-4 font-semibold">
        Agendamentos de hoje
      </h3>
      <ul className="mt-2 divide-y divide-border">
        {dia.agendamentos.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 py-3 text-xs"
          >
            <div>
              <strong>
                {hora(item.inicio)} · {item.cliente}
              </strong>
              <p className="text-muted">{item.servico}</p>
            </div>
            <BadgeStatus alerta={item.status === "PENDENTE"}>
              {item.status === "PENDENTE" ? "Pendente" : "Confirmado"}
            </BadgeStatus>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export function ControlesAgenda() {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <BotaoIndisponivel destaque>+ Novo agendamento</BotaoIndisponivel>
      <div className="flex gap-2">
        <BotaoIndisponivel>‹</BotaoIndisponivel>
        <BotaoIndisponivel>
          07 de Setembro de 2026 - 12 de Setembro de 2026
        </BotaoIndisponivel>
        <BotaoIndisponivel>›</BotaoIndisponivel>
      </div>
      <div className="flex gap-2">
        <BotaoIndisponivel>Dia</BotaoIndisponivel>
        <BotaoIndisponivel destaque>Semana</BotaoIndisponivel>
        <BotaoIndisponivel>Mês</BotaoIndisponivel>
      </div>
    </div>
  );
}
