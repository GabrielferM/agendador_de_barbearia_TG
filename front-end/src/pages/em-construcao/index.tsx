import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useAutenticacao } from '../../auth/contexto-autenticacao'

interface PaginaEmConstrucaoProps {
  titulo: string
  descricao: string
}

export function PaginaEmConstrucao({ titulo, descricao }: PaginaEmConstrucaoProps) {
  const { usuario, sair } = useAutenticacao()
  const navigate = useNavigate()
  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-12 text-foreground">
      <section className="w-full max-w-lg rounded-3xl border border-border bg-surface p-8 text-center shadow-sm sm:p-12">
        <span
          aria-hidden="true"
          className="mx-auto grid size-16 place-items-center rounded-full border border-secondary bg-primary text-3xl text-secondary"
        >
          ✂
        </span>
        <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-primary">Corte Certo</p>
        <h1 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">{titulo}</h1>
        <p className="mt-4 leading-7 text-muted">{descricao}</p>
        {usuario && <p className="mt-3 text-sm text-muted">Sessão de {usuario.nome}</p>}
        {usuario && <button className="mt-6 rounded-lg border border-border px-5 py-2 text-sm font-bold" type="button" onClick={async () => { await sair(); navigate('/login', { replace: true }) }}>Sair</button>}
        <Link
          className="mt-8 inline-flex rounded-lg border border-primary bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          to="/"
        >
          Voltar ao início
        </Link>
      </section>
    </main>
  )
}
