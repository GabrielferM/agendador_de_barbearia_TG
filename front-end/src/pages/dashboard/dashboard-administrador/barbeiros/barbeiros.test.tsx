import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { BarbeirosAdministrador } from './index';
vi.mock('../../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_USUARIOS'] } }) }));
afterEach(() => vi.unstubAllGlobals());
function montar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><BarbeirosAdministrador /></MemoryRouter></QueryClientProvider>); }
it('edita status profissional usando filial real e preserva a senha vazia', async () => {
 const payloads: Record<string, unknown>[] = [];
 vi.stubGlobal('fetch', vi.fn(async (url: string, options: RequestInit) => {
  if (options.method === 'PATCH') { payloads.push(JSON.parse(options.body as string)); return new Response('{}'); }
  if (url.endsWith('/barbeiros/2')) return new Response(JSON.stringify({ id: 2, usuario: { nome: 'João', email: 'joao@example.com' }, idFilial: 3, nomeProfissional: 'João', statusProfissional: 'ATIVO', descricao: null, fotoUrl: null, dataAdmissao: null }));
  if (url.includes('/publico/filiais')) return new Response(JSON.stringify({ data: [{ id: 3, nome: 'Centro' }], meta: { pagina: 1, limite: 100, total: 1, totalPaginas: 1 } }));
  return new Response(JSON.stringify({ indicadores: { ativos: 1, atendimentosMes: 5, comissoesAPagar: 10 }, data: [{ id: 2, nome: 'João', filial: 'Centro', status: 'ATIVO', atendimentosHoje: 1, receitaMes: 50, comissoesAPagar: 10 }], meta: { pagina: 1, limite: 10, total: 1, totalPaginas: 1 } }));
 }));
 montar(); await userEvent.click(await screen.findByText('Visualizar João')); await userEvent.click(await screen.findByText('Editar barbeiro')); await userEvent.selectOptions(screen.getByLabelText('Status profissional'), 'AFASTADO'); await userEvent.click(screen.getByText('Salvar')); await screen.findByText('Barbeiro salvo.'); expect(payloads[0]).toMatchObject({ idFilial: 3, statusProfissional: 'AFASTADO' }); expect(payloads[0]).not.toHaveProperty('senha'); expect(screen.queryByText('Especialidades')).not.toBeInTheDocument();
});
it('bloqueia novo cadastro quando não existem filiais ativas', async () => { vi.stubGlobal('fetch', vi.fn(async (url: string) => new Response(JSON.stringify(url.includes('/publico/filiais') ? { data: [], meta: { pagina: 1, limite: 100, total: 0, totalPaginas: 0 } } : { indicadores: { ativos: 0, atendimentosMes: 0, comissoesAPagar: 0 }, data: [], meta: { pagina: 1, limite: 10, total: 0, totalPaginas: 0 } })))); montar(); await screen.findByText('Cadastre uma filial ativa antes de incluir um barbeiro.'); expect(screen.getByText('Novo barbeiro')).toBeDisabled(); });
