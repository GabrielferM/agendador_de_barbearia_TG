export function Disponibilidade() {
  return (
    <section className="flex flex-col items-center justify-between gap-5 bg-primary px-5 py-6 text-center text-white sm:flex-row sm:px-8 sm:text-left lg:px-12">
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <p className="text-xs font-bold uppercase tracking-wide text-secondary">Próximo horário disponível hoje</p>
        <span className="rounded-md border border-secondary px-3 py-2 text-sm font-bold">◷ 09:30</span>
        <p className="text-xs text-secondary">com Lucas Ferreira</p>
      </div>
      <button
        className="cursor-pointer rounded-lg border border-secondary bg-transparent px-5 py-3 text-xs font-bold text-white transition-colors hover:bg-surface hover:text-foreground"
        type="button"
      >
        Ver disponibilidade
      </button>
    </section>
  )
}
