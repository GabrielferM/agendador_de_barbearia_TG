export interface SemanaFinanceira { rotulo: string; receita: number; despesas: number }
export interface FormaPagamento { nome: string; valor: number; percentual: number }
export interface Movimentacao { id: number; data: string; descricao: string; categoria: 'Receita' | 'Despesa' | 'Comissão'; forma: string; valor: number; status: string }
export interface ComissaoBarbeiro { id: number; barbeiro: string; valor: number; pago: boolean }
