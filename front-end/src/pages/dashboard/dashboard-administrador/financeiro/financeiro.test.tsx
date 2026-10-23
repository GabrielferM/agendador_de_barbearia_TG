import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { FinanceiroAdministrador } from './index';
vi.mock('../../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_COMISSOES'] } }) }));
const chamadas: { url: string; method: string; dados: Record<string, unknown> }[] = [];
const porStatus = { PREVISTA: 0, LIBERADA: 0, PAGA: 10, CANCELADA: 0, ESTORNADA: 0 };
const comissao = { id: 3, idAgendamentoServico: 8, idBarbeiro: 2, baseCalculo: '50.00', percentualAplicado: '20.00', valorComissao: '10.00', status: 'PAGA', dataGeracao: '2026-10-01T12:00:00Z', dataLiberacao: '2026-10-01T12:00:00Z', dataPagamento: '2026-10-02T12:00:00Z', dataEstorno: null, motivoEstorno: null, observacao: null, barbeiro: { nomeProfissional: 'João', usuario: { nome: 'João' } }, agendamentoServico: { servico: { nome: 'Corte' }, agendamento: { inicioPrevisto: '2026-10-01T12:00:00Z', cliente: { usuario: { nome: 'Maria' } } } } };
const pagina = (data: unknown[]) => ({ data, meta: { pagina: 1, limite: 10, total: data.length, totalPaginas: data.length ? 1 : 0 } });
beforeEach(() => { chamadas.length = 0; vi.stubGlobal('fetch', vi.fn(async (url: string, opts: RequestInit) => {
 chamadas.push({ url, method: opts.method ?? 'GET', dados: opts.body ? JSON.parse(opts.body as string) : {} });
 if (opts.method === 'POST') return new Response('{}', { status: 201 });
 if (opts.method === 'PATCH') return new Response('{}');
 if (url.includes('/dashboard/administrador/financeiro')) return new Response(JSON.stringify({ indicadores: { receita: 50, variacaoReceitaPercentual: 0, comissoes: 10, comissoesPorStatus: porStatus }, fluxoSemanal: [{ inicio: '2026-10-01', receita: 50 }], movimentacoesRecentes: [], comissoesPorBarbeiro: [{ id: 2, barbeiro: 'João', total: 10, porStatus }] }));
 if (url.includes('/comissoes/itens-elegiveis')) return new Response(JSON.stringify(pagina([{ id: 9, idBarbeiro: 2, cliente: 'Maria', barbeiro: 'João', servico: 'Corte', inicioPrevisto: '2026-10-01T12:00:00Z', subtotal: '50.00' }])));
 if (url.endsWith('/comissoes/3')) return new Response(JSON.stringify(comissao));
 return new Response(JSON.stringify(pagina([comissao])));
})); });
afterEach(() => vi.unstubAllGlobals());
function montar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><FinanceiroAdministrador /></MemoryRouter></QueryClientProvider>); }
it('registra comissão com item real e percentual informado', async () => {
 montar(); await userEvent.click(screen.getByRole('button', { name: 'Nova comissão' })); await screen.findByRole('option', { name: /Maria.*João.*Corte/ }); await userEvent.selectOptions(screen.getByLabelText('Item elegível'), '9'); await userEvent.type(screen.getByLabelText('Percentual aplicado (%)'), '25'); await userEvent.click(screen.getByText('Registrar comissão')); await screen.findByText('Comissão registrada.'); expect(chamadas.find(c => c.method === 'POST')?.dados).toMatchObject({ idAgendamentoServico: 9, idBarbeiro: 2, percentualAplicado: 25 });
 expect(screen.queryByText('Despesas')).not.toBeInTheDocument(); expect(screen.queryByText('Lucro líquido')).not.toBeInTheDocument(); expect(screen.queryByText('Registrar movimentação')).not.toBeInTheDocument();
});
it('estorna uma comissão paga com motivo e sem exclusão física', async () => {
 montar(); await userEvent.click(await screen.findByText('Detalhes da comissão 3')); await userEvent.selectOptions(await screen.findByLabelText('Nova situação'), 'ESTORNADA'); await userEvent.type(screen.getByLabelText('Motivo do estorno'), 'Correção de registro'); await userEvent.click(screen.getByText('Confirmar atualização')); await screen.findByText('Comissão atualizada.'); expect(chamadas.find(c => c.method === 'PATCH')?.dados).toMatchObject({ status: 'ESTORNADA', motivoEstorno: 'Correção de registro' }); expect(chamadas.some(c => c.method === 'DELETE')).toBe(false);
});
