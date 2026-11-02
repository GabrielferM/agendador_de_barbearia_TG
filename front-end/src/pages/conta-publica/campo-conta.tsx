import { Input } from "@heroui/react";
import { useState } from "react";
import type { InputHTMLAttributes } from "react";

type Props = {
  nome: string;
  label: string;
  erro?: string;
  senha?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;
export function CampoConta({ nome, label, erro, senha, ...props }: Props) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="min-w-0">
      <label htmlFor={nome} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <Input
          {...props}
          id={nome}
          name={nome}
          type={
            senha ? (visivel ? "text" : "password") : (props.type ?? "text")
          }
          aria-invalid={Boolean(erro)}
          aria-describedby={
            [erro ? `${nome}-erro` : "", senha ? "requisitos-senha" : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`w-full border-border bg-surface text-foreground ${senha ? "pr-20" : ""}`}
        />
        {senha && (
          <button
            type="button"
            aria-controls={nome}
            aria-pressed={visivel}
            aria-label={`${visivel ? "Ocultar" : "Mostrar"} ${label.toLowerCase()}`}
            onClick={() => setVisivel(!visivel)}
            className="absolute right-2 inset-y-0 my-auto h-fit rounded px-2 py-1 text-xs font-semibold text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
          >
            {visivel ? "Ocultar" : "Mostrar"}
          </button>
        )}
      </div>
      {erro && (
        <p
          id={`${nome}-erro`}
          role="alert"
          className="mt-1 text-sm text-danger"
        >
          {erro}
        </p>
      )}
    </div>
  );
}
