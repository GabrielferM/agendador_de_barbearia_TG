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
  tentar: () => void;
}

interface CartaoBarbeiroProps {
  barbeiro: Barbeiro;
}

function CartaoBarbeiro({ barbeiro }: CartaoBarbeiroProps) {
  const [imagemIndisponivel, setImagemIndisponivel] = useState(false);
  const inicial = barbeiro.nome.trim().charAt(0).toUpperCase() || "?";

  return (
    <article className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left xl:p-6 2xl:p-8">
      {barbeiro.fotoUrl && !imagemIndisponivel ? (
        <img
          alt={`Foto de ${barbeiro.nome}`}
          className="size-16 shrink-0 2xl:size-20 rounded-lg object-cover"
          onError={() => setImagemIndisponivel(true)}
          src={barbeiro.fotoUrl}
        />
      ) : (
        <span
          aria-hidden="true"
          className="grid size-16 shrink-0 2xl:size-20 place-items-center rounded-lg bg-primary text-2xl font-bold text-secondary"
        >
          {inicial}
        </span>
      )}
      <div className="min-w-0">
        <h3 className="text-sm font-bold xl:text-base 2xl:text-lg">{barbeiro.nome}</h3>
        {barbeiro.descricao?.trim() && <p className="mt-1 text-sm leading-6 xl:text-base 2xl:text-lg 2xl:leading-7 text-foreground">{barbeiro.descricao}</p>}
      </div>
    </article>
  );
}

export function Barbeiro({ itens, carregando, comErro, tentar }: BarbeiroProps) {
  return (
    <section className="bg-background px-5 py-14 sm:px-8 lg:px-12" id="barbeiros">
      <div className="mx-auto inicio-container text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-foreground">
          NOSSOS BARBEIROS
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl 2xl:text-5xl">
          Conheça quem vai cuidar do seu estilo
        </h2>
        <p className="mx-auto mt-4 max-w-2xl 2xl:max-w-3xl text-sm leading-6 xl:text-base 2xl:text-lg 2xl:leading-7">Conheça nossa equipe antes de escolher com quem agendar seu atendimento.</p>
        {carregando ? (
          <p className="mt-9 text-sm text-foreground" role="status">
            Carregando barbeiros...
          </p>
        ) : null}
        {comErro ? (
          <div>
            <p className="mt-9 text-sm text-danger" role="alert">
            Não foi possível carregar os barbeiros.
          </p>
            <button
              type="button"
              onClick={tentar}
              className="mt-3 rounded-lg border border-primary px-4 py-2 font-semibold text-primary"
            >
              Tentar novamente
            </button>
          </div>
        ) : null}
        {!carregando && !comErro && itens.length === 0 ? (
          <p className="mt-9 text-sm text-foreground">
            Nenhum barbeiro disponível no momento.
          </p>
        ) : null}
        {!carregando && !comErro && itens.length > 0 ? (
          <div className="mt-9 grid gap-4 xl:gap-6 2xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((barbeiro) => (
              <CartaoBarbeiro barbeiro={barbeiro} key={barbeiro.id} />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
