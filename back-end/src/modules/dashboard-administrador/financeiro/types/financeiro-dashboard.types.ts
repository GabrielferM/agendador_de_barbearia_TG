export interface PeriodoFinanceiroDashboard {
  inicio: Date;
  fimExclusivo: Date;
  inicioAnterior: Date;
  fimAnteriorExclusivo: Date;
}

export interface ComissaoPorBarbeiroDashboard {
  id: number;
  barbeiro: string;
  total: number;
  porStatus: Record<string, number>;
}
