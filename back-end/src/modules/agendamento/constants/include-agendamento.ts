export const includeAgendamento = {
  cliente: {
    include: {
      usuario: { select: { id: true, nome: true, email: true, telefone: true, status: true } },
    },
  },
  barbeiro: {
    include: {
      usuario: { select: { id: true, nome: true, email: true, telefone: true, status: true } },
      filial: { include: { endereco: true } },
    },
  },
  filial: { include: { endereco: true } },
  servicos: { include: { servico: true, comissao: true }, orderBy: { ordemExecucao: 'asc' } },
} as const;
