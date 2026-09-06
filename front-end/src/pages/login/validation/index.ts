import type { CredenciaisLogin } from '../types'

export type ErrosFormularioLogin = Partial<Record<keyof CredenciaisLogin, string>>

const PADRAO_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validarFormularioLogin(valores: CredenciaisLogin): ErrosFormularioLogin {
  const erros: ErrosFormularioLogin = {}
  const email = valores.email.trim()

  if (!email) {
    erros.email = 'Informe seu e-mail.'
  } else if (!PADRAO_EMAIL.test(email)) {
    erros.email = 'Informe um e-mail válido.'
  }

  if (!valores.senha) {
    erros.senha = 'Informe sua senha.'
  }

  return erros
}
