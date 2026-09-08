import type { ServicoAdministrativo } from './types'

export const servicosMock: ServicoAdministrativo[] = [
  { id: 1, nome: 'Corte de cabelo', categoria: 'Cabelo', duracaoMinutos: 45, preco: 45, comissao: 40, ativo: true },
  { id: 2, nome: 'Corte + barba', categoria: 'Combo', duracaoMinutos: 75, preco: 70, comissao: 40, ativo: true },
  { id: 3, nome: 'Barba', categoria: 'Barba', duracaoMinutos: 30, preco: 30, comissao: 35, ativo: true },
  { id: 4, nome: 'Sobrancelha', categoria: 'Estética', duracaoMinutos: 15, preco: 15, comissao: 30, ativo: true },
  { id: 5, nome: 'Hidratação', categoria: 'Tratamento', duracaoMinutos: 30, preco: 35, comissao: 35, ativo: true },
]
