export interface AgendamentoGrade {
  id: number;
  inicio: string;
  cliente: string;
  servico: string;
  barbeiro: string;
  status: "CONFIRMADO" | "PENDENTE" | "EM_ATENDIMENTO";
}

export interface DiaAgenda {
  data: string;
  rotulo: string;
  agendamentos: AgendamentoGrade[];
}
