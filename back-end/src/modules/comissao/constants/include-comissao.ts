export const includeComissao = {
  barbeiro: { select: { id: true, nomeProfissional: true, usuario: { select: { nome: true } } } },
  agendamentoServico: {
    select: {
      id: true,
      servico: { select: { id: true, nome: true } },
      agendamento: {
        select: {
          id: true,
          inicioPrevisto: true,
          status: true,
          cliente: { select: { usuario: { select: { nome: true } } } },
        },
      },
    },
  },
} as const;
