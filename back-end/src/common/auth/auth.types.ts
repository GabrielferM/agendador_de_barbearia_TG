import { Request } from 'express';

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  papel: string;
  permissoes: string[];
  sessaoId: string;
  clienteId?: number;
  barbeiroId?: number;
}

export interface RequisicaoAutenticada extends Request {
  usuarioAtual?: UsuarioAutenticado;
}
