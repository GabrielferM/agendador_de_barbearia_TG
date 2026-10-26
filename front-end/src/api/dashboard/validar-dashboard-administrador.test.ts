import { describe, expect, it } from 'vitest';
import { validarDashboardAdministrador } from './validar-dashboard-administrador';
const painel = { geradoEm: '2026-10-22T12:00:00Z', agendamentosHoje: { valor: 0, variacaoPercentual: 0 }, receitaHoje: { valor: 0, variacaoPercentual: 0 }, clientesAtivos: 0, novosClientesNoMes: 0, barbeirosAtivos: 0, receitaUltimosSeteDias: [], servicosNoMes: [], desempenhoBarbeiros: [], agendamentosRecentes: [] };
describe('Contrato do dashboard administrativo', () => {
 it('aceita banco vazio e rejeita corpo parcial ou valores financeiros inválidos', () => { expect(validarDashboardAdministrador(painel)).toEqual(painel); expect(() => validarDashboardAdministrador({ clientesAtivos: 1 })).toThrow(); expect(() => validarDashboardAdministrador({ ...painel, receitaHoje: { valor: '10.00', variacaoPercentual: 0 } })).toThrow(); });
 it('valida estruturas de gráficos e status de atendimentos', () => { expect(() => validarDashboardAdministrador({ ...painel, receitaUltimosSeteDias: [{ data: 'invalida', valor: 10 }] })).toThrow(); expect(() => validarDashboardAdministrador({ ...painel, agendamentosRecentes: [{ id: 1, inicio: '2026-10-22T12:00:00Z', cliente: 'Maria', barbeiro: 'João', servicos: ['Corte'], status: 'INVALIDO', total: 50 }] })).toThrow(); });
});
