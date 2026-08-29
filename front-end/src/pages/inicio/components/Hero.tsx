export function Hero() {
  return (
    <section className="grid min-h-[27px] items-center gap-10 py-14 lg:grid-cols-[1fr_0.8fr] lg:py-20" id="inicio">
      <div className="max-w-xl">
        <p className="mb-4 text-xs font-bold tracking-[0.18em] text-secondary">CUIDADO QUE FAZ DIFERENÇA</p>
        <h1 className="font-serif text-4xl font-bold leading-[0.95] sm:text-5xl lg:text-6xl">
          Seu estilo.
          <span className="mt-2 block text-secondary">No seu horário.</span>
        </h1>
        <p className="mt-6 max-w-md text-sm leading-6 text-white sm:text-base">
          Agende seu corte com quem entende do assunto e aproveite uma experiência feita para você.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            className="cursor-pointer rounded-lg border border-secondary bg-secondary px-6 py-3 text-sm font-bold text-foreground transition-colors hover:bg-surface"
            type="button"
          >
            ◷ Agendar agora
          </button>
          <button
            className="cursor-pointer rounded-lg border border-secondary bg-transparent px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-surface hover:text-foreground"
            type="button"
          >
            Ver serviços
          </button>
        </div>
      </div>

      <div aria-hidden="true" className="relative mx-auto hidden aspect-square w-full max-w-sm items-center justify-center lg:flex">
        <div className="absolute inset-4 rounded-full border border-secondary opacity-50" />
        <div className="absolute inset-12 rounded-full border border-secondary opacity-50" />
        <div className="grid size-40 place-items-center rounded-full border border-secondary bg-primary text-7xl text-secondary shadow-sm">
          ✂
        </div>
        <span className="absolute bottom-8 left-0 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Corte certo
        </span>
        <span className="absolute right-0 top-10 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
          Desde 2026
        </span>
      </div>
    </section>
  )
}
