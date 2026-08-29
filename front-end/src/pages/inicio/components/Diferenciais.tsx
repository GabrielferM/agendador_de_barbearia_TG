export interface Diferencial {
  icone: string
  titulo: string
  descricao: string
}

interface DiferenciaisProps {
  itens: Diferencial[]
}

export function Diferenciais({ itens }: DiferenciaisProps) {
  return (
    <section aria-label="Diferenciais" className="grid gap-5 border-t border-secondary pt-7 sm:grid-cols-3 sm:gap-8">
      {itens.map((item) => (
        <article className="flex items-center gap-3" key={item.titulo}>
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full border border-secondary text-lg text-secondary"
          >
            {item.icone}
          </span>
          <div>
            <h2 className="text-xs font-bold text-white">{item.titulo}</h2>
            <p className="mt-1 text-xs text-secondary">{item.descricao}</p>
          </div>
        </article>
      ))}
    </section>
  )
}
