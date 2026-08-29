import { Card } from "@heroui/react"

export interface barbeiros {
  icone: string
  nome: string
  duracao: string
  preco: string
}

interface BarbeiroProps {
  itens: barbeiros[]
}

export function Barbeiro({ itens }: BarbeiroProps) {
  return (
    <section className="px-5 py-14 sm:px-8 lg:px-12" id="barbeiro">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-bold tracking-[0.14em] text-muted">NOSSOS BABEIROS</p>
        <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">Escolha o melhor proficional</h2>
        <div className="mt-9 grid gap-4 md:grid-cols-3">
          {itens.map((item) => (
            <Card className="flex items-center rounded-xl border border-border bg-background p-4 text-left" key={item.nome} >
                <img>
                </img>
              <div>
                <h3 className="text-sm font-bold">{item.nome}</h3>
                <p className="mt-1 text-xs text-muted">{item.duracao}</p>
                <p className="mt-3 text-sm font-bold text-primary">{item.preco}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
