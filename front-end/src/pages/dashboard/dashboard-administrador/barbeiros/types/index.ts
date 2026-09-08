export interface BarbeiroAdministrativo {
  id: number;
  nome: string;
  iniciais: string;
  especialidades: string[];
  jornada: string;
  atendimentosHoje: number;
  receitaMes: number;
  comissao: number;
  ativo: boolean;
  disponibilidade: number;
}
