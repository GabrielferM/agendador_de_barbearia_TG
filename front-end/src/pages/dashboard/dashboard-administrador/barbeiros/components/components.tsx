import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
  BotaoIndisponivel,
  CampoVisual,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type { BarbeiroAdministrativo } from "../types";

export function IndicadoresBarbeiros() {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples titulo="Barbeiros ativos" valor="4" icone="usuarios" />
      <IndicadorSimples
        titulo="Atendimentos no mês"
        valor="270"
        icone="agenda"
      />
      <IndicadorSimples
        titulo="Comissões a pagar"
        valor={moeda.format(3240)}
        icone="financeiro"
      />
    </div>
  );
}

export function CartoesBarbeiros({
  barbeiros,
}: {
  barbeiros: BarbeiroAdministrativo[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {barbeiros.map((barbeiro) => (
        <article
          key={barbeiro.id}
          className="rounded-2xl border border-border bg-surface p-4 shadow-sm"
        >
          <header className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-secondary text-lg font-semibold text-white">
              {barbeiro.iniciais}
            </span>
            <h2 className="font-semibold">{barbeiro.nome}</h2>
            <span className="ml-auto">
              <BadgeStatus>Ativo</BadgeStatus>
            </span>
          </header>
          <dl className="mt-5 divide-y divide-border text-sm">
            <div className="py-3">
              <dt className="text-muted">Especialidades</dt>
              <dd>{barbeiro.especialidades.join(", ")}</dd>
            </div>
            <div className="py-3">
              <dt className="text-muted">Horário semanal</dt>
              <dd>{barbeiro.jornada}</dd>
            </div>
            <div className="py-3">
              <dt className="text-muted">Atendimentos hoje</dt>
              <dd className="font-semibold">
                {barbeiro.atendimentosHoje} agendamentos
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-muted">Receita no mês</dt>
              <dd className="font-semibold">
                {moeda.format(barbeiro.receitaMes)}
              </dd>
            </div>
            <div className="py-3">
              <dt className="text-muted">Comissão</dt>
              <dd className="font-semibold">{barbeiro.comissao}%</dd>
            </div>
          </dl>
          <div className="mt-3">
            <BotaoIndisponivel destaque>Ver detalhes</BotaoIndisponivel>
          </div>
        </article>
      ))}
    </div>
  );
}

export function DisponibilidadeEquipe({
  barbeiros,
}: {
  barbeiros: BarbeiroAdministrativo[];
}) {
  return (
    <section className="mt-4 rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="font-serif text-xl font-bold">Disponibilidade de hoje</h2>
      <p className="text-sm text-muted">
        Horários de trabalho da equipe · Segunda-feira, 07 de setembro de 2026
      </p>
      <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {barbeiros.map((item) => (
          <div key={item.id}>
            <div className="flex justify-between text-sm">
              <strong>{item.nome}</strong>
              <BadgeStatus>Ativo</BadgeStatus>
            </div>
            <p className="mt-2 text-xs text-muted">
              {item.jornada.split("·")[1]}
            </p>
            <div className="mt-2 h-2 rounded-full bg-background">
              <div
                className="h-full rounded-full bg-secondary"
                style={{ width: `${item.disponibilidade}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ControlesBarbeiros() {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row">
      <CampoVisual placeholder="Buscar barbeiro" />
      <div className="md:w-64">
        <CampoVisual placeholder="Todos os status" />
      </div>
      <BotaoIndisponivel destaque>+ Novo barbeiro</BotaoIndisponivel>
    </div>
  );
}
