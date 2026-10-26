import type { DashboardAdministradorResposta } from './models';
const objeto = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const numero = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const data = (v: unknown): v is string => typeof v === 'string' && Number.isFinite(Date.parse(v));
const lista = (v: unknown, validar: (item: unknown) => boolean) => Array.isArray(v) && v.every(validar);
const indicador = (v: unknown) => objeto(v) && numero(v.valor) && numero(v.variacaoPercentual);
const status = new Set(['PENDENTE', 'CONFIRMADO', 'EM_ATENDIMENTO', 'CONCLUIDO', 'CANCELADO', 'NAO_COMPARECEU']);
export function validarDashboardAdministrador(v: unknown): DashboardAdministradorResposta {
 if (!objeto(v) || !data(v.geradoEm) || !indicador(v.agendamentosHoje) || !indicador(v.receitaHoje)
  || !['clientesAtivos', 'novosClientesNoMes', 'barbeirosAtivos'].every(c => Number.isInteger(v[c]) && Number(v[c]) >= 0)
  || !lista(v.receitaUltimosSeteDias, p => objeto(p) && data(p.data) && numero(p.valor))
  || !lista(v.servicosNoMes, s => objeto(s) && typeof s.nome === 'string' && Number.isInteger(s.quantidade) && Number(s.quantidade) >= 0 && numero(s.percentual) && s.percentual >= 0 && s.percentual <= 100)
  || !lista(v.desempenhoBarbeiros, b => objeto(b) && Number.isInteger(b.id) && typeof b.nome === 'string' && Number.isInteger(b.atendimentos) && numero(b.receita))
  || !lista(v.agendamentosRecentes, a => objeto(a) && Number.isInteger(a.id) && data(a.inicio) && typeof a.cliente === 'string' && typeof a.barbeiro === 'string' && typeof a.status === 'string' && status.has(a.status) && numero(a.total) && lista(a.servicos, s => typeof s === 'string')))
  throw new Error('Resposta inválida do painel administrativo.');
 return v as unknown as DashboardAdministradorResposta;
}
