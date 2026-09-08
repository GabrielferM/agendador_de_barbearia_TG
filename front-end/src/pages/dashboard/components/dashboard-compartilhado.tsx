import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import { dataCurta, moeda } from "./dashboard-formatadores";

const icones: Record<string, ReactNode> = {
  dashboard: <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z" />,
  agenda: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
    </>
  ),
  usuarios: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  servicos: (
    <>
      <path d="m9.5 14.5-4 4a2.1 2.1 0 0 1-3-3l4-4M14 6l4-4 4 4-4 4M8 8l8 8" />
    </>
  ),
  financeiro: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 6v12" />
    </>
  ),
  sair: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    </>
  ),
};

export function Icone({
  nome,
  className = "size-5",
}: {
  nome: string;
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {icones[nome] ?? icones.dashboard}
    </svg>
  );
}

export interface ItemMenu {
  rotulo: string;
  icone: string;
  ativo?: boolean;
  destino?: string;
  desabilitado?: boolean;
}

export function DashboardLayout({
  titulo,
  subtitulo,
  itens,
  dadosDemonstrativos = false,
  children,
}: {
  titulo: string;
  subtitulo: string;
  itens: ItemMenu[];
  dadosDemonstrativos?: boolean;
  children: ReactNode;
}) {
  const { usuario, sair } = useAutenticacao();
  const navigate = useNavigate();
  const dataCabecalho = dadosDemonstrativos
    ? new Date("2026-09-07T12:00:00-03:00")
    : new Date();
  const hoje = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dataCabecalho);

  return (
    <main className="min-h-screen bg-background text-foreground lg:grid lg:grid-cols-[230px_minmax(0,1fr)]">
      <aside className="bg-primary px-4 py-5 text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
        <div className="flex items-center gap-3 border-b border-white/15 pb-5">
          <span
            className="grid size-11 place-items-center rounded-full border border-secondary text-xl"
            aria-hidden="true"
          >
            ✂
          </span>
          <div>
            <p className="font-serif text-lg font-bold tracking-wide">
              CORTE CERTO
            </p>
            <p className="text-[10px] tracking-[0.28em] text-secondary">
              BARBEARIA
            </p>
          </div>
        </div>
        <nav
          aria-label="Navegação principal"
          className="mt-4 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible"
        >
          {itens.map((item) =>
            item.destino && !item.desabilitado ? (
              <NavLink
                key={item.rotulo}
                end={item.destino === "/admin"}
                to={item.destino}
                className={({ isActive }) =>
                  `flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${isActive ? "bg-secondary/30 font-semibold" : "hover:bg-white/10"}`
                }
              >
                <Icone nome={item.icone} />
                {item.rotulo}
              </NavLink>
            ) : (
              <button
                key={item.rotulo}
                type="button"
                disabled={item.desabilitado ?? !item.ativo}
                title={
                  (item.desabilitado ?? !item.ativo) ? "Em breve" : undefined
                }
                className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${item.ativo ? "bg-secondary/30 font-semibold" : "cursor-not-allowed opacity-55"}`}
              >
                <Icone nome={item.icone} />
                {item.rotulo}
                {(item.desabilitado ?? !item.ativo) && (
                  <span className="sr-only"> — Em breve</span>
                )}
              </button>
            ),
          )}
        </nav>
        <button
          className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-white/10 lg:mt-auto"
          type="button"
          onClick={async () => {
            await sair();
            navigate("/login", { replace: true });
          }}
        >
          <Icone nome="sair" />
          Sair
        </button>
        <p className="mt-5 hidden border-t border-white/15 pt-5 text-xs leading-5 text-secondary lg:block">
          Mais que um corte.
          <br />É confiança.
        </p>
      </aside>
      <section className="min-w-0 p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-serif text-2xl font-bold sm:text-3xl">
                {titulo}
              </h1>
              {dadosDemonstrativos && (
                <span className="rounded-full border border-secondary bg-background px-3 py-1 text-xs font-semibold text-primary">
                  Dados demonstrativos
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">{subtitulo}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs capitalize text-muted">{hoje}</p>
            <p className="mt-1 text-sm font-semibold">{usuario?.nome}</p>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

export function Cartao({
  titulo,
  children,
  className = "",
}: {
  titulo?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-2xl border border-border bg-surface p-4 shadow-sm ${className}`}
    >
      {titulo && <h2 className="mb-4 font-semibold">{titulo}</h2>}
      {children}
    </section>
  );
}

export function Kpi({
  rotulo,
  valor,
  detalhe,
  icone,
}: {
  rotulo: string;
  valor: string;
  detalhe: string;
  icone: string;
}) {
  return (
    <Cartao>
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary text-white">
          <Icone nome={icone} />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">{rotulo}</p>
          <p className="truncate text-xl font-bold">{valor}</p>
          <p className="text-xs text-success">{detalhe}</p>
        </div>
      </div>
    </Cartao>
  );
}

export function EstadoCarregamento() {
  return (
    <div className="grid min-h-64 place-items-center" role="status">
      <p className="text-muted">Carregando indicadores…</p>
    </div>
  );
}

export function EstadoErro({
  mensagem,
  tentarNovamente,
}: {
  mensagem: string;
  tentarNovamente: () => void;
}) {
  return (
    <div
      className="rounded-2xl border border-danger bg-surface p-8 text-center"
      role="alert"
    >
      <p className="text-danger">{mensagem}</p>
      <button
        className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-hover"
        onClick={tentarNovamente}
        type="button"
      >
        Tentar novamente
      </button>
    </div>
  );
}

export function EstadoIntegracaoIndisponivel() {
  return (
    <div className="grid min-h-64 place-items-center rounded-2xl border border-border bg-surface p-8 text-center">
      <div>
        <p className="font-serif text-xl font-bold">
          Área disponível em modo demonstrativo
        </p>
        <p className="mt-2 text-sm text-muted">
          Defina VITE_USAR_DADOS_MOCKADOS=true e reinicie o front-end para
          visualizar este exemplo.
        </p>
      </div>
    </div>
  );
}

export function Barras({
  pontos,
  moedaValores = false,
}: {
  pontos: { data: string; valor: number }[];
  moedaValores?: boolean;
}) {
  const maximo = Math.max(...pontos.map((item) => item.valor), 1);
  if (!pontos.length)
    return (
      <p className="py-12 text-center text-sm text-muted">
        Nenhum dado no período.
      </p>
    );
  return (
    <div
      className="flex h-48 items-end gap-3"
      aria-label="Gráfico dos últimos sete dias"
    >
      {pontos.map((item) => (
        <div
          className="flex min-w-0 flex-1 flex-col items-center gap-2"
          key={item.data}
        >
          <span className="text-[10px] font-semibold">
            {moedaValores ? moeda.format(item.valor) : item.valor}
          </span>
          <div
            className="w-full rounded-t bg-secondary"
            style={{
              height: `${Math.max((item.valor / maximo) * 120, item.valor ? 8 : 2)}px`,
            }}
          />
          <span className="text-[10px] text-muted">{dataCurta(item.data)}</span>
        </div>
      ))}
    </div>
  );
}
