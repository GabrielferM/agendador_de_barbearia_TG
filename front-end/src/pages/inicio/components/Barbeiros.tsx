import { useState } from "react";

export interface Barbeiro {
  id: number;
  nome: string;
  descricao: string | null;
  fotoUrl: string | null;
}

interface BarbeiroProps {
  itens: Barbeiro[];
  carregando: boolean;
  comErro: boolean;
}

interface CartaoBarbeiroProps {
  barbeiro: Barbeiro;
}

function CartaoBarbeiro({ barbeiro }: CartaoBarbeiroProps) {
  const [imagemIndisponivel, setImagemIndisponivel] = useState(false);
  const inicial = barbeiro.nome.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left">
      {barbeiro.fotoUrl && !imagemIndisponivel ? (
        <img
          alt={`Foto de ${barbeiro.nome}`}
          className="size-16 shrink-0 rounded-lg object-cover"
          onError={() => setImagemIndisponivel(true)}
          src={barbeiro.fotoUrl}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary text-2xl font-bold text-secondary"
        >
          {inicial}
        </span>
      )}
      <div>
        <h3 className="text-sm font-bold">{barbeiro.nome}</h3>
        <p className="mt-1 text-xs text-muted">
          {barbeiro.descricao || "Profissional da nossa equipe."}
        </p>
      </div>
    </article>
  );
}

export function Barbeiro({ itens, carregando, comErro }: BarbeiroProps) {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-12" id="barbeiro">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-muted">
          NOSSOS BABEIROS
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
          Escolha o melhor profissional
        </h2>
        {carregando ? (
          <p className="mt-9 text-sm text-muted" role="status">
            Carregando barbeiros...
          </p>
        ) : null}
        {comErro ? (
          <p className="mt-9 text-sm text-danger" role="alert">
            Não foi possível carregar os barbeiros.
          </p>
        ) : null}
        {!carregando && !comErro && itens.length === 0 ? (
          <p className="mt-9 text-sm text-muted">
            Nenhum barbeiro disponível no momento.
          </p>
        ) : null}
        {!carregando && !comErro && itens.length > 0 ? (
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {itens.map((barbeiro) => (
              <CartaoBarbeiro barbeiro={barbeiro} key={barbeiro.id} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
