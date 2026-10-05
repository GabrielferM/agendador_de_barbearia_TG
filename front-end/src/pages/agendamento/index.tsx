import { Button } from "@heroui/react";
import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAgendamento } from "./hooks/use-agendamento";
import {
  EtapasAgendamento,
  EstadoConsulta,
} from "./components/etapas-agendamento";
import { ResumoAgendamento } from "./components/resumo-agendamento";
import { dataHorario, endereco, moeda } from "./formatadores";
import { mensagemErro } from "./services/agendamento-api";

export function AgendamentoCliente() {
  const a = useAgendamento();
  const navigate = useNavigate();
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    document.title = a.criacao.isSuccess ? "Agendamento realizado — Corte Certo" : `${a.indice + 1} de ${a.etapas.length}: ${a.etapa} — Corte Certo`;
    titulo.current?.focus();
  }, [a.etapa, a.indice, a.etapas.length, a.criacao.isSuccess]);
  const total =
    a.selecionados.reduce(
      (s, i) => s + Math.round(Number(i.precoBase) * 100),
      0,
    ) / 100;
  const duracao = a.selecionados.reduce((s, i) => s + i.duracaoMinutos, 0);
  if (a.criacao.isSuccess)
    return (
      <main className="min-h-screen bg-background px-4 py-12 text-foreground">
        <section className="mx-auto max-w-3xl space-y-6 rounded-2xl border border-border bg-surface p-6 sm:p-10">
          <p className="font-semibold text-success" role="status">
            Agendamento realizado!
          </p>
          <h1 ref={titulo} tabIndex={-1} className="font-serif text-3xl outline-none">
            Seu próximo cuidado está marcado.
          </h1>
          <p>
            Agendamento nº {a.criacao.data.id} registrado. Acompanhe a situação
            em Meus agendamentos.
          </p>
          <ResumoAgendamento item={a.criacao.data} />
          <Link
            className="inline-block rounded-lg bg-primary px-5 py-3 font-semibold text-white"
            to="/cliente/agendamentos"
          >
            Meus agendamentos
          </Link>
        </section>
      </main>
    );
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface px-4 py-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link to="/" className="font-serif text-2xl font-bold text-primary">
            Corte Certo
          </Link>
          <nav className="flex gap-4 text-sm">
            <Link
              to="/cliente/agendamentos"
              className="font-semibold text-primary"
            >
              Meus agendamentos
            </Link>
            <button
              type="button"
              className="text-muted underline"
              onClick={() => {
                a.alterar({ tipo: "limpar" });
                navigate("/");
              }}
            >
              Sair do agendamento
            </button>
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          Um tempo para você
        </p>
        <h1 className="mt-2 font-serif text-3xl sm:text-4xl">
          Agende seu atendimento
        </h1>
        <p className="mt-3 text-muted">
          Escolha o lugar, o profissional e o cuidado que combina com você.
        </p>
        <EstadoConsulta
          carregando={a.filiais.isPending}
          erro={a.filiais.error}
          vazio={!a.filiais.data?.length}
          mensagemVazio="Nenhuma filial disponível para agendamento no momento."
          tentar={() => void a.filiais.refetch()}
        >
          <nav aria-label="Etapas do agendamento" className="my-8">
            <ol className="flex flex-wrap gap-2 sm:gap-4">
              {a.etapas.map((nome, i) => (
                <li
                  key={nome}
                  aria-current={i === a.indice ? "step" : undefined}
                  className={`flex items-center gap-2 border-b-2 pb-3 text-sm ${i <= a.indice ? "border-primary text-primary" : "border-border text-muted"}`}
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-7 w-7 place-items-center rounded-full ${i <= a.indice ? "bg-primary text-white" : "bg-surface"}`}
                  >
                    {i < a.indice ? "✓" : i + 1}
                  </span>
                  <button
                    type="button"
                    disabled={i > a.indice || a.criacao.isPending}
                    onClick={() => a.ir(nome)}
                    className="rounded font-semibold focus-visible:outline-primary disabled:cursor-default"
                  >
                    {nome}
                    <span className="sr-only">
                      {i < a.indice
                        ? ", concluída"
                        : i === a.indice
                          ? ", atual"
                          : ", pendente"}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </nav>
          <div className="grid items-start gap-8 lg:grid-cols-[1fr_320px]">
            <section className="min-w-0 rounded-2xl border border-border bg-surface p-5 sm:p-8">
              <h2
                ref={titulo}
                tabIndex={-1}
                className="mb-6 font-serif text-2xl outline-none"
              >
                {a.etapa}{" "}
                <span className="text-sm font-normal text-muted">
                  ({a.indice + 1} de {a.etapas.length})
                </span>
              </h2>
              <fieldset disabled={a.criacao.isPending} className="min-w-0">
                <EtapasAgendamento agenda={a} />
              </fieldset>
              {a.aviso && (
                <p role="alert" className="mt-4 text-danger">
                  {a.aviso}
                </p>
              )}
              {a.criacao.isError && (
                <div role="alert" className="mt-4 text-danger">
                  <p>{mensagemErro(a.criacao.error)}</p>
                  <p className="mt-1 text-sm">
                    Se a conexão caiu durante o envio, consulte Meus
                    agendamentos antes de tentar novamente.
                  </p>
                </div>
              )}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
                <Button
                  variant="secondary"
                  isDisabled={a.indice === 0 || a.criacao.isPending}
                  onPress={() => a.ir(a.etapas[a.indice - 1])}
                >
                  Voltar
                </Button>
                {a.etapa !== "Confirmar" ? (
                  <Button
                    isDisabled={!a.podeAvancar}
                    onPress={() => a.ir(a.etapas[a.indice + 1])}
                  >
                    Continuar
                  </Button>
                ) : !a.usuario ? (
                  <Button
                    isDisabled={a.carregando}
                    onPress={() =>
                      navigate("/login", { state: { retorno: "/agendar" } })
                    }
                  >
                    {a.carregando
                      ? "Verificando sessão…"
                      : "Entrar para confirmar"}
                  </Button>
                ) : a.usuario.papel !== "CLIENTE" ? (
                  <p role="alert" className="text-sm text-danger">
                    Entre com uma conta de cliente para agendar.
                  </p>
                ) : (
                  <Button
                    isDisabled={
                      !a.horarioValido ||
                      !a.filial ||
                      !a.barbeiro ||
                      !a.servicosValidos ||
                      a.criacao.isPending
                    }
                    onPress={() => {
                      if (!a.criacao.isPending) a.criacao.mutate();
                    }}
                  >
                    {a.criacao.isPending
                      ? "Confirmando…"
                      : "Confirmar agendamento"}
                  </Button>
                )}
              </div>
            </section>
            <aside
              aria-label="Resumo do agendamento"
              className="rounded-2xl border border-border bg-surface p-6 lg:sticky lg:top-6"
            >
              <h2 className="font-serif text-xl">Seu atendimento</h2>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="text-muted">Filial</dt>
                  <dd className="font-semibold">
                    {a.filial?.nome ?? "Escolha uma filial"}
                  </dd>
                  {a.filial && (
                    <dd className="mt-1 text-muted">{endereco(a.filial)}</dd>
                  )}
                </div>
                <div>
                  <dt className="text-muted">Barbeiro</dt>
                  <dd>{a.barbeiro?.nomeProfissional ?? "A escolher"}</dd>
                </div>
                <div>
                  <dt className="text-muted">
                    Serviços ({a.selecionados.length})
                  </dt>
                  <dd>
                    {a.selecionados.map((s) => s.nome).join(", ") ||
                      "A escolher"}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted">Data e horário de Brasília</dt>
                  <dd>
                    {a.rascunho.inicio
                      ? dataHorario(a.rascunho.inicio)
                      : "A escolher"}
                  </dd>
                </div>
              </dl>
              <div className="mt-6 flex justify-between border-t border-border pt-5">
                <span className="text-sm text-muted">
                  {a.horarios.data?.duracaoTotalMinutos ?? duracao} min
                </span>
                <strong className="text-xl text-primary">
                  {moeda(a.horarios.data?.valorTotal ?? total)}
                </strong>
              </div>
              <p className="mt-4 text-xs text-muted">
                Os valores e a disponibilidade são conferidos ao confirmar.
              </p>
            </aside>
          </div>
        </EstadoConsulta>
      </div>
    </main>
  );
}
