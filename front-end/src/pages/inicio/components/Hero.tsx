import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section
      className="grid items-center gap-10 py-14 lg:grid-cols-[1fr_0.8fr] lg:py-20"
      id="inicio"
    >
      <div className="min-w-0 max-w-xl xl:max-w-none">
        <p className="mb-4 text-xs font-bold tracking-[0.18em] text-white">
          CUIDADO QUE FAZ DIFERENÇA
        </p>
        <h1 className="font-serif text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl xl:text-[clamp(3.75rem,4.4vw,5.5rem)]">
          Seu estilo.
          <span className="mt-2 block text-secondary">No seu horário.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-6 text-white sm:text-base xl:text-lg 2xl:text-xl 2xl:leading-8 2xl:max-w-xl">
          Agende seu corte com quem entende do assunto e aproveite uma
          experiência feita para você.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            className="cursor-pointer rounded-lg border border-secondary bg-secondary px-6 py-3 2xl:px-8 2xl:py-4 text-sm font-bold xl:text-base 2xl:text-lg text-foreground transition-colors hover:bg-surface"
            to="/agendar"
          >
            ◷ Agendar agora
          </Link>
          <a
            className="cursor-pointer rounded-lg border border-secondary bg-transparent px-6 py-3 2xl:px-8 2xl:py-4 text-sm font-bold xl:text-base 2xl:text-lg text-white transition-colors hover:bg-surface hover:text-foreground"
            href="#servicos"
          >
            Ver serviços
          </a>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="relative mx-auto hidden aspect-square w-full max-w-sm xl:max-w-[clamp(24rem,28vw,35rem)] items-center justify-center lg:flex"
      >
        <div className="absolute inset-4 rounded-full border border-secondary opacity-50" />
        <div className="absolute inset-12 rounded-full border border-secondary opacity-50" />
        <div className="grid size-40 xl:size-[clamp(10rem,12vw,15rem)] place-items-center rounded-full border border-secondary bg-primary text-7xl 2xl:text-8xl text-secondary shadow-sm">
          ✂
        </div>
        <span className="absolute bottom-8 left-0 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Corte certo
        </span>
        <span className="absolute right-0 top-10 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          Seu próximo cuidado
        </span>
      </div>
    </section>
  );
}
