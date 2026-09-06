import { Button, Input } from '@heroui/react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLogin } from '../hooks/use-login'
import type { CredenciaisLogin } from '../types'
import { type ErrosFormularioLogin, validarFormularioLogin } from '../validation'

const VALORES_INICIAIS: CredenciaisLogin = { email: '', senha: '' }

export function FormularioLogin() {
  const [valores, setValores] = useState(VALORES_INICIAIS)
  const [erros, setErros] = useState<ErrosFormularioLogin>({})
  const [senhaVisivel, setSenhaVisivel] = useState(false)
  const login = useLogin()

  function atualizarCampo(campo: keyof CredenciaisLogin, valor: string) {
    setValores((atuais) => ({ ...atuais, [campo]: valor }))
    setErros((atuais) => ({ ...atuais, [campo]: undefined }))
    if (login.isError) login.reset()
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (login.isPending) return

    const novosErros = validarFormularioLogin(valores)
    setErros(novosErros)
    if (Object.keys(novosErros).length > 0) return

    login.mutate({ email: valores.email.trim(), senha: valores.senha })
  }

  return (
    <form className="space-y-5" noValidate onSubmit={enviar}>
      <div>
        <label className="mb-2 block text-sm font-semibold" htmlFor="email">
          E-mail
        </label>
        <Input
          aria-describedby={erros.email ? 'email-erro' : undefined}
          aria-invalid={Boolean(erros.email)}
          autoCapitalize="none"
          autoComplete="username"
          className="w-full border-border bg-surface text-foreground placeholder:text-muted"
          id="email"
          inputMode="email"
          maxLength={254}
          name="email"
          onChange={(evento) => atualizarCampo('email', evento.target.value)}
          placeholder="voce@exemplo.com"
          spellCheck={false}
          type="email"
          value={valores.email}
        />
        {erros.email ? (
          <p className="mt-2 text-sm text-danger" id="email-erro" role="alert">
            {erros.email}
          </p>
        ) : null}
      </div>

      <div>
        <div className="mb-2 flex gap-4">
          <label className="text-sm font-semibold" htmlFor="senha">
            Senha
          </label>
        </div>
        <div className="relative">
          <Input
            aria-describedby={erros.senha ? 'senha-erro' : undefined}
            aria-invalid={Boolean(erros.senha)}
            autoComplete="current-password"
            className="w-full border-border bg-surface pr-24 text-foreground placeholder:text-muted"
            id="senha"
            maxLength={256}
            name="senha"
            onChange={(evento) => atualizarCampo('senha', evento.target.value)}
            placeholder="Digite sua senha"
            type={senhaVisivel ? 'text' : 'password'}
            value={valores.senha}
          />
          <button
            aria-controls="senha"
            aria-label={senhaVisivel ? 'Ocultar senha' : 'Mostrar senha'}
            aria-pressed={senhaVisivel}
            className="absolute inset-y-0 right-3 my-auto h-fit rounded px-2 py-1 text-xs font-bold text-primary hover:bg-background focus-visible:outline-2 focus-visible:outline-primary"
            onClick={() => setSenhaVisivel((visivel) => !visivel)}
            type="button"
          >
            {senhaVisivel ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        {erros.senha ? (
          <p className="mt-2 text-sm text-danger" id="senha-erro" role="alert">
            {erros.senha}
          </p>
        ) : null}
      </div>

      {login.mensagemErro ? (
        <div className="rounded-lg border border-danger bg-surface px-4 py-3 text-sm text-danger" role="alert">
          {login.mensagemErro}
        </div>
      ) : null}

      <Button
        className="w-full bg-primary font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        fullWidth
        isDisabled={login.isPending}
        type="submit"
      >
        {login.isPending ? 'Entrando…' : 'Entrar'}
      </Button>
        <div className="text-center">
          <Link className="text-xs font-semibold text-primary underline-offset-4 hover:underline" to="/recuperar-senha">
            Esqueci minha senha
          </Link>
        </div>

      <p className="text-center text-sm text-muted">
        Ainda não tem uma conta?{' '}
        <Link className="font-bold text-primary underline-offset-4 hover:underline" to="/cadastro">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
