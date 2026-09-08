export interface IndicadorDashboard {
  valor: number
  variacaoPercentual: number
}

export interface PontoSerieDashboard {
  data: string
  valor: number
}

export interface ServicoDashboard {
  nome: string
  quantidade: number
  percentual: number
}

export interface AgendamentoResumoDashboard {
  id: number
  inicio: string
  cliente: string
  barbeiro: string
  servicos: string[]
  status: string
  total: number
}

export interface BarbeiroDesempenhoDashboard {
  id: number
  nome: string
  fotoUrl?: string | null
  atendimentos: number
  receita: number
}

export interface DashboardAdministradorResposta {
  geradoEm: string
  agendamentosHoje: IndicadorDashboard
  receitaHoje: IndicadorDashboard
  clientesAtivos: number
  novosClientesNoMes: number
  barbeirosAtivos: number
  receitaUltimosSeteDias: PontoSerieDashboard[]
  servicosNoMes: ServicoDashboard[]
  desempenhoBarbeiros: BarbeiroDesempenhoDashboard[]
  agendamentosRecentes: AgendamentoResumoDashboard[]
}

export interface DashboardBarbeiroResposta {
  geradoEm: string
  atendimentosHoje: IndicadorDashboard
  receitaHoje: IndicadorDashboard
  clientesNaSemana: IndicadorDashboard
  atendimentosUltimosSeteDias: PontoSerieDashboard[]
  servicosNoMes: ServicoDashboard[]
  agendaHoje: AgendamentoResumoDashboard[]
  proximosAgendamentos: AgendamentoResumoDashboard[]
}
