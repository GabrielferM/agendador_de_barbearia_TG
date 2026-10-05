import { Calendar, I18nProvider } from "@heroui/react";
import { parseDate, today } from "@internationalized/date";
import type { ReactNode } from "react";
import type { useAgendamento } from "../hooks/use-agendamento";
import { endereco, horario, moeda } from "../formatadores";
import { mensagemErro } from "../services/agendamento-api";

type Agenda = ReturnType<typeof useAgendamento>;
export function EstadoConsulta({
  carregando,
  erro,
  vazio,
  mensagemVazio,
  tentar,
  children,
}: {
  carregando: boolean;
  erro: unknown;
  vazio: boolean;
  mensagemVazio?: string;
  tentar: () => void;
  children: ReactNode;
}) {
  if (carregando)
    return (
      <p role="status" className="py-8 text-muted">
        Carregando opções…
      </p>
    );
  if (erro)
    return (
      <div role="alert" className="py-6">
        <p>{mensagemErro(erro)}</p>
        <button
          type="button"
          className="mt-3 font-semibold text-primary underline"
          onClick={tentar}
        >
          Tentar novamente
        </button>
      </div>
    );
  if (vazio)
    return (
      <p role="status" className="py-8 text-muted">
        Nenhuma opção disponível no momento.
        {mensagemVazio && <span className="block">{mensagemVazio}</span>}
      </p>
    );
  return children;
}
export function Escolha({
  nome,
  valor,
  selecionado,
  selecionar,
  children,
}: {
  nome: string;
  valor: number | string;
  selecionado: boolean;
  selecionar: () => void;
  children: ReactNode;
}) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors focus-within:outline-2 focus-within:outline-primary ${selecionado ? "border-primary bg-background" : "border-border bg-surface hover:border-primary"}`}
    >
      <input
        type="radio"
        name={nome}
        value={valor}
        checked={selecionado}
        onChange={selecionar}
        className="mt-1 accent-primary"
      />
      <span className="min-w-0 flex-1">{children}</span>
    </label>
  );
}
export function EtapasAgendamento({ agenda: a }: { agenda: Agenda }) {
  if (a.etapa === "Filial")
    return (
      <fieldset className="space-y-3">
        <legend className="sr-only">Selecione a filial</legend>
        {a.filiais.data?.map((f) => (
          <Escolha
            key={f.id}
            nome="filial"
            valor={f.id}
            selecionado={a.filial?.id === f.id}
            selecionar={() => a.selecionarFilial(f.id)}
          >
            <strong className="block">{f.nome}</strong>
            <span className="mt-1 block text-sm text-muted">{endereco(f)}</span>
            {f.telefone && <span className="block text-sm">{f.telefone}</span>}
          </Escolha>
        ))}
      </fieldset>
    );
  if (a.etapa === "Barbeiro")
    return (
      <EstadoConsulta
        carregando={a.barbeiros.isPending}
        erro={a.barbeiros.error}
        vazio={!a.barbeiros.data?.length}
        tentar={() => void a.barbeiros.refetch()}
      >
        <fieldset className="grid gap-3 sm:grid-cols-2">
          <legend className="sr-only">Selecione o barbeiro</legend>
          {a.barbeiros.data?.map((b) => (
            <Escolha
              key={b.id}
              nome="barbeiro"
              valor={b.id}
              selecionado={a.barbeiro?.id === b.id}
              selecionar={() => a.alterar({ tipo: "barbeiro", id: b.id })}
            >
              <span className="flex items-center gap-3">
                {b.fotoUrl ? (
                  <img
                    src={b.fotoUrl}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-background font-serif text-xl text-primary"
                  >
                    {b.nomeProfissional[0]}
                  </span>
                )}
                <strong>{b.nomeProfissional}</strong>
              </span>
              {b.descricao && (
                <span className="mt-3 block text-sm text-muted">
                  {b.descricao}
                </span>
              )}
            </Escolha>
          ))}
        </fieldset>
      </EstadoConsulta>
    );
  if (a.etapa === "Serviços")
    return (
      <EstadoConsulta
        carregando={a.servicos.isPending}
        erro={a.servicos.error}
        vazio={!a.servicos.data?.length}
        tentar={() => void a.servicos.refetch()}
      >
        <fieldset className="divide-y divide-border">
          <legend className="sr-only">Selecione um ou mais serviços</legend>
          {a.servicos.data?.map((s) => (
            <label
              key={s.id}
              className="flex cursor-pointer items-start gap-4 py-5 focus-within:outline-2 focus-within:outline-primary"
            >
              <input
                type="checkbox"
                checked={a.rascunho.servicoIds.includes(s.id)}
                onChange={(e) =>
                  a.alterar({
                    tipo: "servicos",
                    ids: e.target.checked
                      ? [...a.rascunho.servicoIds, s.id]
                      : a.rascunho.servicoIds.filter((id) => id !== s.id),
                  })
                }
                className="mt-1 accent-primary"
              />
              <span className="flex-1">
                <strong className="block">{s.nome}</strong>
                <span className="block text-sm text-muted">{s.descricao}</span>
                <span className="mt-2 block text-sm">
                  {s.duracaoMinutos} min
                </span>
              </span>
              <strong className="text-primary">{moeda(s.precoBase)}</strong>
            </label>
          ))}
        </fieldset>
      </EstadoConsulta>
    );
  if (a.etapa === "Data e horário")
    return (
      <div className="space-y-6">
        <p className="text-sm text-muted">
          Segunda a sábado, das 09h às 18h. Horário de Brasília. A consulta não
          reserva o horário.
        </p>
        <div className="flex flex-wrap gap-8">
          <I18nProvider locale="pt-BR">
            <Calendar
              aria-label="Data do agendamento"
              value={a.rascunho.data ? parseDate(a.rascunho.data) : null}
              minValue={today("America/Sao_Paulo")}
              isDateUnavailable={(dia) =>
                new Date(`${dia.toString()}T12:00:00Z`).getUTCDay() === 0
              }
              onChange={(dia) =>
                a.alterar({
                  tipo: "atualizar",
                  dados: { data: dia?.toString() ?? "", inicio: "" },
                })
              }
            >
              <Calendar.Header>
                <Calendar.NavButton slot="previous" aria-label="Mês anterior" />
                <Calendar.Heading />
                <Calendar.NavButton slot="next" aria-label="Próximo mês" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(dia) => <Calendar.HeaderCell>{dia}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(dia) => <Calendar.Cell date={dia} />}
                </Calendar.GridBody>
              </Calendar.Grid>
            </Calendar>
          </I18nProvider>
          <div className="min-w-0 flex-1 basis-56">
            {!a.rascunho.data ? (
              <p className="text-muted">
                Selecione uma data para consultar horários.
              </p>
            ) : (
              <EstadoConsulta
                carregando={a.horarios.isFetching}
                erro={a.horarios.error}
                vazio={!a.horarios.data?.horarios.length}
                tentar={() => void a.horarios.refetch()}
              >
                <fieldset className="grid grid-cols-2 gap-2">
                  <legend className="mb-3 font-semibold">
                    Horários disponíveis
                  </legend>
                  {a.horarios.data?.horarios.map((h) => (
                    <Escolha
                      key={h.inicio}
                      nome="horario"
                      valor={h.inicio}
                      selecionado={a.rascunho.inicio === h.inicio}
                      selecionar={() =>
                        a.alterar({
                          tipo: "atualizar",
                          dados: { inicio: h.inicio },
                        })
                      }
                    >
                      {horario(h.inicio)}
                    </Escolha>
                  ))}
                </fieldset>
              </EstadoConsulta>
            )}
          </div>
        </div>
      </div>
    );
  return (
    <div className="space-y-5">
      <p>
        Confira os detalhes do seu atendimento no resumo antes de confirmar.
      </p>
      <label className="block font-semibold" htmlFor="observacao">
        Observação para o atendimento{" "}
        <span className="font-normal text-muted">(opcional)</span>
      </label>
      <textarea
        id="observacao"
        rows={4}
        value={a.rascunho.observacao}
        onChange={(e) =>
          a.alterar({
            tipo: "atualizar",
            dados: { observacao: e.target.value },
          })
        }
        className="w-full rounded-lg border border-border bg-surface p-3 focus-visible:outline-primary"
      />
      {a.horarios.isFetching && (
        <p role="status">Conferindo disponibilidade…</p>
      )}
      {a.horarios.error && <p role="alert">{mensagemErro(a.horarios.error)}</p>}
      {!a.horarioValido && !a.horarios.isFetching && (
        <p role="alert" className="text-danger">
          Revise suas escolhas e selecione um horário disponível antes de
          confirmar.
        </p>
      )}
    </div>
  );
}
