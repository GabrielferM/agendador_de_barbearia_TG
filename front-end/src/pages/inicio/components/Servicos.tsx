import { Disponibilidade } from "./Disponibilidade";
export interface Servico {
  id: number;
  icone: string;
  nome: string;
  duracao: string;
  preco: string;
}

interface ServicosProps {
  itens: Servico[];
  carregando: boolean;
  comErro: boolean;
  tentar: () => void;
  agendar: (id: number) => void;
}

export function Servicos({ itens, carregando, comErro, tentar, agendar }: ServicosProps) {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-12" id="servicos">
      <div className="mx-auto inicio-container text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-foreground">
          NOSSOS SERVIÇOS
        </p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl 2xl:text-5xl">
          Tudo para o seu melhor corte
        </h2>
        <p className="mx-auto mt-4 max-w-2xl 2xl:max-w-3xl text-sm leading-6 xl:text-base 2xl:text-lg 2xl:leading-7">Compare os serviços, confira a duração e escolha o atendimento que combina com você.</p>
        {carregando ? (
          <p className="mt-9 text-sm text-foreground" role="status">
            Carregando serviços...
          </p>
        ) : null}
        {comErro ? (
          <div>
            <p className="mt-9 text-sm text-danger" role="alert">
            Não foi possível carregar os serviços.
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
            Nenhum serviço disponível no momento.
          </p>
        ) : null}
        {!carregando && !comErro && itens.length > 0 ? (
          <div className="mt-9 grid gap-4 xl:gap-6 2xl:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {itens.map((item) => (
              <article
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left xl:p-6 2xl:p-8"
                key={item.id}
              >
                <span
                  aria-hidden="true"
                  className="grid size-16 shrink-0 2xl:size-20 place-items-center rounded-lg bg-primary text-3xl text-secondary"
                >
                  {item.icone}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold xl:text-base 2xl:text-lg">{item.nome}</h3>
                  <p className="mt-1 text-xs text-foreground xl:text-sm 2xl:text-base">{item.duracao}</p>
                  <p className="mt-3 text-sm font-bold xl:text-base 2xl:text-lg text-primary">
                    {item.preco}
                  </p>
                  <button type="button" onClick={() => agendar(item.id)} aria-label={`Agendar este serviço: ${item.nome}`} className="mt-4 rounded-lg border border-primary bg-primary px-4 py-3 text-sm font-bold xl:text-base 2xl:text-lg text-white hover:bg-primary-hover">Agendar este serviço</button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        <div className="mt-8 overflow-hidden rounded-xl"><Disponibilidade /></div>
      </div>
    </section>
  );
}
