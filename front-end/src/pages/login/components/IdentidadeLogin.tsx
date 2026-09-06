import { Link } from 'react-router-dom'

const beneficios = ['Agendamentos em poucos passos', 'Horários e profissionais em um só lugar', 'Acesso para clientes e equipe']

export function IdentidadeLogin() {
  return (
    <section className="relative overflow-hidden bg-primary px-7 py-9 text-white sm:px-10 lg:flex lg:min-h-[650px] lg:flex-col lg:justify-between lg:px-12 lg:py-12">
      <div aria-hidden="true" className="absolute -right-24 -top-24 size-72 rounded-full border border-secondary opacity-30" />
      <div aria-hidden="true" className="absolute -bottom-32 -left-24 size-80 rounded-full border border-secondary opacity-30" />

      <Link
        aria-label="Voltar para a página inicial"
        className="relative inline-flex w-fit items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
        to="/"
      >
        <span aria-hidden="true" className="grid size-12 place-items-center rounded-full border border-secondary text-2xl text-secondary">
          ✂
        </span>
        <span className="leading-none">
          <strong className="block font-serif text-xl tracking-wide">CORTE CERTO</strong>
          <span className="block pt-1 text-[0.65rem] font-semibold tracking-[0.28em] text-secondary">BARBEARIA</span>
        </span>
      </Link>

      <div className="relative mt-12 max-w-lg lg:my-auto">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-secondary">Seu estilo, no seu horário</p>
        <h1 className="mt-4 font-serif text-4xl font-bold leading-tight sm:text-5xl">Bem-vindo de volta.</h1>
        <p className="mt-5 max-w-md leading-7 text-white">
          Entre para organizar seus horários e cuidar da sua experiência na Corte Certo.
        </p>

        <ul className="mt-8 hidden space-y-4 lg:block">
          {beneficios.map((beneficio) => (
            <li className="flex items-center gap-3 text-sm" key={beneficio}>
              <span aria-hidden="true" className="grid size-6 place-items-center rounded-full bg-secondary font-bold text-foreground">
                ✓
              </span>
              {beneficio}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-10 hidden text-xs text-secondary lg:block">Atendimento com cuidado em cada detalhe.</p>
    </section>
  )
}
