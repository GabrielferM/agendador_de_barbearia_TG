import type { ReactNode } from "react";
import { Cartao, Icone } from "../../components/dashboard-compartilhado";

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
