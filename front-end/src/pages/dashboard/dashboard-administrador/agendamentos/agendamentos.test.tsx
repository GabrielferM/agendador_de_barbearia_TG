import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { AgendamentosAdministrador } from './index';
import { dataLocal, periodoAgenda } from './services/agendamentos-api';
vi.mock('../../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_AGENDAMENTOS'] } }) }));
const chamadas: { url: string; method: string; dados: Record<string, unknown> }[] = [];
const pagina = (data: unknown[]) => ({ data, meta: { pagina: 1, limite: 10, total: data.length, totalPaginas: data.length ? 1 : 0 } });
beforeEach(() => { chamadas.length = 0; vi.stubGlobal('fetch', vi.fn(async (url: string, opts: RequestInit) => {
 chamadas.push({ url, method: opts.method ?? 'GET', dados: opts.body ? JSON.parse(opts.body as string) : {} });
 if (opts.method === 'POST') return new Response('{}', { status: 201 });
 if (opts.method === 'PATCH') return new Response('{}');
 if (url.includes('/historico-status')) return new Response(JSON.stringify(pagina([])));
 if (url.endsWith('/agendamentos/7')) return new Response(JSON.stringify({ id: 7, idCliente: 2, idBarbeiro: 4, idFilial: 3, inicioPrevisto: '2030-01-07T12:00:00Z', status: 'PENDENTE', cliente: { usuario: { nome: 'Maria' } }, barbeiro: { nomeProfissional: 'João' }, filial: { nome: 'Centro' }, servicos: [{ idServico: 5, quantidade: 1, desconto: '0.00', servico: { nome: 'Corte' } }] }));
 if (url.includes('/dashboard/administrador/agendamentos/clientes')) return new Response(JSON.stringify(pagina([{ id: 2, nome: 'Maria' }])));
 if (url.includes('/publico/filiais')) return new Response(JSON.stringify(pagina([{ id: 3, nome: 'Centro' }])));
 if (url.includes('/publico/barbeiros')) return new Response(JSON.stringify(pagina([{ id: 4, nomeProfissional: 'João' }])));
 if (url.includes('/publico/servicos')) return new Response(JSON.stringify(pagina([{ id: 5, nome: 'Corte' }])));
 const dia = dataLocal(new Date().toISOString()).slice(0, 10);
 return new Response(JSON.stringify({ dias: [{ data: dia, rotulo: 'Dia', agendamentos: [{ id: 7, inicio: '2030-01-07T12:00:00Z', fim: '2030-01-07T12:30:00Z', cliente: 'Maria', barbeiro: 'João', servicos: ['Corte'], status: 'PENDENTE', total: 30 }] }] }));
})); });
afterEach(() => vi.unstubAllGlobals());
function montar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><AgendamentosAdministrador /></MemoryRouter></QueryClientProvider>); }
it('cria atendimento administrativo com seletores reais e horário com fuso', async () => {
 montar(); await userEvent.click(screen.getByText('Novo agendamento'));
 await screen.findAllByRole('option', { name: 'Centro' });
 await userEvent.selectOptions(screen.getByLabelText('Cliente', { exact: true }), '2');
 await userEvent.selectOptions(screen.getByLabelText('Filial', { exact: true }), '3');
 await userEvent.selectOptions(screen.getByLabelText('Barbeiro', { exact: true }), '4');
 await userEvent.selectOptions(screen.getByLabelText('Adicionar serviço'), '5'); await userEvent.click(screen.getByText('Adicionar'));
 fireEvent.change(screen.getByLabelText('Início (horário de São Paulo)'), { target: { value: '2030-01-07T09:00' } });
 await userEvent.click(screen.getByText('Salvar agendamento')); await screen.findByText('Agendamento salvo.');
 expect(chamadas.find(c => c.method === 'POST')?.dados).toMatchObject({ idCliente: 2, idFilial: 3, idBarbeiro: 4, inicio: '2030-01-07T09:00:00-03:00', origem: 'ADMINISTRADOR', servicos: [{ idServico: 5, quantidade: 1, desconto: 0 }] });
});
it('altera status em uma única mutação, sem POST separado de histórico', async () => {
 montar(); await userEvent.click(await screen.findByRole('button', { name: /Maria.*João/ }));
 await screen.findByText('Histórico de status'); await userEvent.selectOptions(screen.getByLabelText('Novo status'), 'CONFIRMADO'); await userEvent.click(screen.getByText('Confirmar novo status')); await screen.findByText('Agendamento salvo.');
 expect(chamadas.filter(c => c.method === 'PATCH')).toEqual([expect.objectContaining({ dados: { status: 'CONFIRMADO' } })]);
 expect(chamadas.some(c => c.method === 'POST' && c.url.includes('historico-status'))).toBe(false);
});
it('calcula semana e meses sem ultrapassar os 31 dias aceitos', () => {
 expect(periodoAgenda('2030-01-09', 'Semana')).toEqual({ inicioDe: '2030-01-07', inicioAte: '2030-01-13' });
 expect(periodoAgenda('2028-02-10', 'Mês')).toEqual({ inicioDe: '2028-02-01', inicioAte: '2028-02-29' });
 expect(periodoAgenda('2030-12-31', 'Mês')).toEqual({ inicioDe: '2030-12-01', inicioAte: '2030-12-31' });
});
