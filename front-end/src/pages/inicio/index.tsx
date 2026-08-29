import { Barbeiro } from './components/Barbeiros'
import { Cabecalho } from './components/Cabecalho'
import { Diferenciais, type Diferencial } from './components/Diferenciais'
import { Disponibilidade } from './components/Disponibilidade'
import { Hero } from './components/Hero'
import { Servicos, type Servico } from './components/Servicos'

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

const servicos: Servico[] = [
  {
    icone: '✂',
    nome: 'Corte de Cabelo',
    duracao: '30 minutos',
    preco: 'R$ 35,00',
  },
  {
    icone: '▱',
    nome: 'Barba',
    duracao: '20 minutos',
    preco: 'R$ 25,00',
  },
  {
    icone: '✂',
    nome: 'Corte + Barba',
    duracao: '50 minutos',
    preco: 'R$ 50,00',
  },
]

export function Inicio() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto overflow-hidden bg-surface shadow-sm">
        <section className="bg-primary px-5 py-5 text-white sm:px-8 lg:px-12 lg:py-7">
          <Cabecalho />
          <Hero />
          <Diferenciais itens={diferenciais} />
        </section>
        <Barbeiro itens={servicos} />
        <Servicos itens={servicos} />
        <Disponibilidade />
      </div>
    </main>
  )
}
