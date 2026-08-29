const itensNavegacao = ['Início', 'Serviços', 'Barbeiros', 'Sobre', 'Contato']

export function Cabecalho() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-white">
        <span
          aria-hidden="true"
          className="grid size-11 place-items-center rounded-full border border-secondary text-2xl text-secondary"
        >
          ✂
        </span>
        <span className="leading-none">
          <strong className="block font-serif text-lg tracking-wide sm:text-xl">CORTE CERTO</strong>
          <span className="block pt-1 text-[0.65rem] font-semibold tracking-[0.28em] text-secondary">
            BARBEARIA
          </span>
        </span>
      </div>

      <nav aria-label="Navegação principal" className="hidden items-center gap-6 lg:flex">
        {itensNavegacao.map((item) => (
          <button
            className="cursor-pointer border-0 bg-transparent p-0 text-xs font-semibold text-white transition-opacity hover:opacity-75"
            key={item}
            type="button"
          >
            {item}
          </button>
        ))}
      </nav>

      <button
        className="cursor-pointer rounded-lg border border-secondary bg-secondary px-4 py-3 text-xs font-bold text-foreground transition-colors hover:bg-surface sm:px-5"
        type="button"
      >
        Agendar horário
      </button>
    </header>
  )
}
