import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { autenticar, ErroLogin } from '../services/login-api'
import type { CodigoPapel, CredenciaisLogin } from '../types'
import { useAutenticacao } from '../../../auth/contexto-autenticacao'

const ROTA_POR_PAPEL: Record<CodigoPapel, string> = {
  CLIENTE: '/cliente',
  BARBEIRO: '/barbeiro',
  ADMINISTRADOR: '/admin',
}

export function useLogin() {
  const navigate = useNavigate()
  const { definirUsuario } = useAutenticacao()
  const mutation = useMutation({
    mutationFn: (credenciais: CredenciaisLogin) => autenticar(credenciais),
    onSuccess: ({ usuario }) => {
      definirUsuario(usuario)
      navigate(ROTA_POR_PAPEL[usuario.papel], { replace: true })
    },
  })

  return {
    ...mutation,
    mensagemErro:
      mutation.error instanceof ErroLogin
        ? mutation.error.message
        : mutation.isError
          ? 'O acesso está indisponível no momento. Tente novamente mais tarde.'
          : null,
  }
}
