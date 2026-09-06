export const includeComissao = {
  barbeiro: { include: { usuario: { select: { id: true, nome: true, email: true } } } },
  agendamentoServico: { include: { agendamento: true, servico: true } },
} as const;
