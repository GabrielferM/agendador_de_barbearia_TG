import { Barbeiro } from './components/Barbeiros'
import { Cabecalho } from './components/Cabecalho'
import { Diferenciais, type Diferencial } from './components/Diferenciais'
import { Disponibilidade } from './components/Disponibilidade'
import { Hero } from './components/Hero'
import { Servicos } from './components/Servicos'
import { useBarbeirosInicio } from './hooks/use-barbeiros-inicio'
import { useServicosInicio } from './hooks/use-servicos-inicio'

const diferenciais: Diferencial[] = [
  {
    icone: '▣',
    titulo: 'Agendamento online',
    descricao: 'Rápido e prático',
  },
  {
    icone: '♙',
    titulo: 'Profissionais',
    descricao: 'Experientes e atentos',
  },
  {
    icone: '✦',
    titulo: 'Ambiente',
    descricao: 'Confortável e moderno',
  },
]

export function Inicio() {
  const servicos = useServicosInicio()
  const barbeiros = useBarbeirosInicio()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto overflow-hidden bg-surface shadow-sm">
        <section className="bg-primary px-5 py-5 text-white sm:px-8 lg:px-12 lg:py-7">
          <Cabecalho />
          <Hero />
          <Diferenciais itens={diferenciais} />
        </section>
        <Barbeiro
          carregando={barbeiros.isLoading}
          comErro={barbeiros.comErro}
          itens={barbeiros.itens}
        />
        <Servicos
          carregando={servicos.isLoading}
          comErro={servicos.comErro}
          itens={servicos.itens}
        />
        <Disponibilidade />
      </div>
    </main>
  )
}
