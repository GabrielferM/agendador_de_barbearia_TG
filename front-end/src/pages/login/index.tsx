import { Card } from '@heroui/react'
import { FormularioLogin } from './components/FormularioLogin'
import { IdentidadeLogin } from './components/IdentidadeLogin'

export function Login() {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-6 sm:py-8 lg:grid lg:place-items-center">
      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl border border-border bg-surface shadow-sm lg:grid-cols-[1.05fr_0.95fr]">
        <IdentidadeLogin />

        <section className="grid place-items-center px-6 py-10 sm:px-12 lg:px-16">
          <Card className="w-full max-w-md border-0 bg-surface shadow-none">
            <Card.Header className="block px-0 pb-8">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Acesse sua conta</p>
              <Card.Title className="mt-2 font-serif text-3xl font-bold">Entrar</Card.Title>
              <Card.Description className="mt-3 leading-6 text-muted">
                Use o e-mail e a senha cadastrados para continuar.
              </Card.Description>
            </Card.Header>
            <Card.Content className="px-0">
              <FormularioLogin />
            </Card.Content>
          </Card>
        </section>
      </div>
    </main>
  )
}
