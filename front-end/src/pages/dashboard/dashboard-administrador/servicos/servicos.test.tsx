import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, it, vi } from 'vitest';
import { ServicosAdministrador } from './index';
vi.mock('../../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_SERVICOS'] } }) }));
afterEach(() => vi.unstubAllGlobals());
it('edita preço e inativa serviço com payload correto e mantém falha de exclusão visível', async () => {
 const payloads: unknown[] = [];
 vi.stubGlobal('fetch', vi.fn(async (url: string, options: RequestInit) => {
  if (options.method === 'PATCH') { payloads.push(JSON.parse(options.body as string)); return new Response('{}'); }
  if (options.method === 'DELETE') return new Response('{}', { status: 409 });
  if (url.endsWith('/servicos/2')) return new Response(JSON.stringify({ id: 2, nome: 'Corte', descricao: null, precoBase: '35.00', duracaoMinutos: 30, ativo: true }));
  return new Response(JSON.stringify({ indicadores: { ativos: 1, maisRealizado: 'Corte', ticketMedio: 35 }, data: [{ id: 2, nome: 'Corte', preco: 35, duracaoMinutos: 30, ativo: true, realizadosMes: 1, receitaMes: 35 }], meta: { pagina: 1, limite: 10, total: 1, totalPaginas: 1 } }));
 }));
 render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><ServicosAdministrador /></MemoryRouter></QueryClientProvider>);
 await userEvent.click(await screen.findByText('Visualizar Corte')); await userEvent.click(await screen.findByText('Editar serviço')); await userEvent.selectOptions(screen.getByLabelText('Situação'), 'false'); await userEvent.clear(screen.getByLabelText('Preço base (R$)')); await userEvent.type(screen.getByLabelText('Preço base (R$)'), '40.50'); await userEvent.click(screen.getByText('Salvar')); await screen.findByText('Serviço salvo.'); expect(payloads[0]).toMatchObject({ precoBase: 40.5, ativo: false, duracaoMinutos: 30 });
 await userEvent.click(screen.getByText('Excluir Corte')); await userEvent.click(screen.getByText('Confirmar exclusão')); expect(await screen.findByRole('alert')).toHaveTextContent('possui vínculos'); expect(screen.queryByText('Categoria')).not.toBeInTheDocument();
});
