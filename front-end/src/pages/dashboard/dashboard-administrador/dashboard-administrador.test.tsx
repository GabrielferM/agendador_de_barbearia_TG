import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { DashboardAdministrador } from './index';
vi.mock('../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_AGENDAMENTOS'] }, encerrarSessaoLocal: vi.fn().mockResolvedValue(undefined) }) }));
const painel = { geradoEm: '2026-10-22T12:00:00Z', agendamentosHoje: { valor: 0, variacaoPercentual: 0 }, receitaHoje: { valor: 0, variacaoPercentual: 0 }, clientesAtivos: 7, novosClientesNoMes: 0, barbeirosAtivos: 0, receitaUltimosSeteDias: [], servicosNoMes: [], desempenhoBarbeiros: [], agendamentosRecentes: [] };
beforeEach(() => vi.stubEnv('VITE_USAR_DADOS_MOCKADOS', 'false'));
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); });
function montar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><DashboardAdministrador /></MemoryRouter></QueryClientProvider>); }
it('atualiza os indicadores explicitamente e oferece acesso à agenda', async () => { vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify(painel)))); montar(); await screen.findByText('7'); expect(screen.queryByText(/em tempo real/)).not.toBeInTheDocument(); expect(screen.getByRole('link', { name: 'Abrir agenda' })).toHaveAttribute('href', '/admin/agendamentos'); await userEvent.click(screen.getByText('Atualizar painel')); expect(fetch).toHaveBeenCalledTimes(2); });
it('mostra erro de permissão sem renderizar números ou dados demonstrativos', async () => { vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{}', { status: 403 }))); montar(); await screen.findByText('Você não possui permissão para visualizar este painel.'); expect(screen.queryByText('Clientes ativos')).not.toBeInTheDocument(); expect(screen.queryByText('Dados demonstrativos')).not.toBeInTheDocument(); expect(fetch).toHaveBeenCalledTimes(1); });
it('rejeita uma resposta JSON incompleta e oferece nova tentativa', async () => { vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{}'))); montar(); await screen.findByText('Não foi possível carregar o painel.', {}, { timeout: 3000 }); expect(screen.getByRole('button', { name: /Tentar novamente/i })).toBeInTheDocument(); });
