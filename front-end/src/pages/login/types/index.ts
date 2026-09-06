export const CODIGOS_PAPEL = ['CLIENTE', 'BARBEIRO', 'ADMINISTRADOR'] as const

export type CodigoPapel = (typeof CODIGOS_PAPEL)[number]

export interface CredenciaisLogin {
  email: string
  senha: string
}

export interface UsuarioAutenticado {
  id: number
  nome: string
  email: string
  papel: CodigoPapel
  permissoes: string[]
}

export interface RespostaLogin {
  usuario: UsuarioAutenticado
}

export type TipoErroLogin = 'credenciais' | 'limite' | 'indisponivel' | 'resposta-invalida'
