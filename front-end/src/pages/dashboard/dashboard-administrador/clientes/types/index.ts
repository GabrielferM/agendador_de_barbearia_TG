export interface ClienteAdministrativo {
  id: number;
  nome: string;
  telefone: string;
  email: string;
  ultimoAtendimento: string;
  proximoHorario?: string;
  ativo: boolean;
}
