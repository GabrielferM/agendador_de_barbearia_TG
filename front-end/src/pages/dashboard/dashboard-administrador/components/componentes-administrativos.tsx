import type { ReactNode } from "react";
import { Cartao, Icone } from "../../components/dashboard-compartilhado";

export function BarraFerramentas({ children }: { children: ReactNode }) {
  return <div className="mb-5 flex flex-col gap-3 md:flex-row">{children}</div>;
}

export function CampoVisual({
  placeholder,
  className = "",
}: {
  placeholder: string;
  className?: string;
}) {
  return (
    <div
      aria-disabled="true"
      className={`flex min-h-12 flex-1 items-center gap-3 rounded-xl border border-border bg-surface px-4 text-muted ${className}`}
    >
      <Icone nome="dashboard" className="size-4" />
      <span className="text-sm">{placeholder}</span>
      <span className="sr-only">Controle demonstrativo, indisponível</span>
    </div>
  );
}

export function BotaoIndisponivel({
  children,
  destaque = false,
}: {
  children: ReactNode;
  destaque?: boolean;
}) {
  return (
    <button
      type="button"
      disabled
      title="Disponível na integração real"
      className={`min-h-12 cursor-not-allowed rounded-xl border px-5 text-sm font-semibold opacity-70 ${destaque ? "border-primary bg-primary text-white" : "border-primary bg-surface text-primary"}`}
    >
      {children}
      <span className="sr-only"> — Disponível na integração real</span>
    </button>
  );
}

export function IndicadorSimples({
  titulo,
  valor,
  icone = "dashboard",
  detalhe,
}: {
  titulo: string;
  valor: string;
  icone?: string;
  detalhe?: string;
}) {
  return (
    <Cartao>
      <div className="flex items-center gap-4">
        <span className="grid size-12 place-items-center rounded-xl bg-primary text-white">
          <Icone nome={icone} />
        </span>
        <div>
          <p className="text-sm text-muted">{titulo}</p>
          <p className="text-2xl font-bold">{valor}</p>
          {detalhe && <p className="text-xs text-success">{detalhe}</p>}
        </div>
      </div>
    </Cartao>
  );
}

export function BadgeStatus({
  children,
  negativo = false,
  alerta = false,
}: {
  children: ReactNode;
  negativo?: boolean;
  alerta?: boolean;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${negativo ? "bg-danger/10 text-danger" : alerta ? "bg-secondary/20 text-primary" : "bg-success/10 text-success"}`}
    >
      {children}
    </span>
  );
}
