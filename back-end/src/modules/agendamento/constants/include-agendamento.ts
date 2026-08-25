export const includeAgendamento = {
  cliente: {
    include: { usuario: { select: { id: true, nome: true, email: true, tipoPerfil: true } } },
  },
  barbeiro: {
    include: { usuario: { select: { id: true, nome: true, email: true, tipoPerfil: true } } },
  },
  filial: true,
  servicos: { include: { servico: true } },
} as const;
