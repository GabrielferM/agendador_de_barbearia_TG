import type {
  ComissaoBarbeiro,
  FormaPagamento,
  Movimentacao,
  SemanaFinanceira,
} from "../types";

export const fluxoFinanceiroMock: SemanaFinanceira[] = [
  { rotulo: "Semana 1", receita: 7280, despesas: 1920 },
  { rotulo: "Semana 2", receita: 7960, despesas: 2240 },
  { rotulo: "Semana 3", receita: 8440, despesas: 2360 },
  { rotulo: "Semana 4", receita: 8800, despesas: 2240 },
];

export const formasPagamentoMock: FormaPagamento[] = [
  { nome: "Pix", valor: 14950.8, percentual: 46 },
  { nome: "Cartão", valor: 12667.2, percentual: 39 },
  { nome: "Dinheiro", valor: 4862, percentual: 15 },
];

export const movimentacoesMock: Movimentacao[] = [
  {
    id: 1,
    data: "07/09/2026",
    descricao: "Corte de cabelo - Matheus Lima",
    categoria: "Receita",
    forma: "PIX",
    valor: 60,
    status: "Confirmado",
  },
  {
    id: 2,
    data: "07/09/2026",
    descricao: "Compra de produtos",
    categoria: "Despesa",
    forma: "Cartão",
    valor: 450,
    status: "Confirmado",
  },
  {
    id: 3,
    data: "06/09/2026",
    descricao: "Corte + barba - Fernanda Alves",
    categoria: "Receita",
    forma: "Cartão",
    valor: 80,
    status: "Confirmado",
  },
  {
    id: 4,
    data: "06/09/2026",
    descricao: "Comissão - João da Silva",
    categoria: "Comissão",
    forma: "PIX",
    valor: 620,
    status: "Pago",
  },
  {
    id: 5,
    data: "05/09/2026",
    descricao: "Aluguel do salão",
    categoria: "Despesa",
    forma: "PIX",
    valor: 1800,
    status: "Confirmado",
  },
];

export const comissoesMock: ComissaoBarbeiro[] = [
  { id: 1, barbeiro: "João da Silva", valor: 1820, pago: true },
  { id: 2, barbeiro: "Carlos Almeida", valor: 1644, pago: true },
  { id: 3, barbeiro: "Gabriel Santos", valor: 1536, pago: false },
  { id: 4, barbeiro: "Rafael Costa", valor: 1496, pago: false },
];
