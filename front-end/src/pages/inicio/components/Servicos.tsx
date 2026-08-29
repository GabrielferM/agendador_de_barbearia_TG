export interface Servico {
  icone: string
  nome: string
  duracao: string
  preco: string
}

interface ServicosProps {
  itens: Servico[]
}

export function Servicos({ itens }: ServicosProps) {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-12" id="servicos">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-muted">NOSSOS SERVIÇOS</p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Tudo para o seu melhor corte</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {itens.map((item) => (
            <article className="flex items-center gap-4 rounded-xl border border-border bg-background p-4 text-left" key={item.nome}>
              <span
                aria-hidden="true"
                className="grid size-16 shrink-0 place-items-center rounded-lg bg-primary text-3xl text-secondary"
              >
                {item.icone}
              </span>
              <div>
                <h3 className="text-sm font-bold">{item.nome}</h3>
                <p className="mt-1 text-xs text-muted">{item.duracao}</p>
                <p className="mt-3 text-sm font-bold text-primary">{item.preco}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
