import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { ClientesAdministrador } from './index';
vi.mock('../../../../auth/contexto-autenticacao', () => ({ useAutenticacao: () => ({ usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_USUARIOS'] }, logout: vi.fn() }) }));
const cliente = { id: 2, nome: 'Maria', email: 'maria@example.com', telefone: null, status: 'ATIVO', ultimoAtendimento: null, proximoHorario: null };
const chamadas: { url: string; metodo?: string; body?: string }[] = [];
beforeEach(() => { chamadas.length = 0; vi.stubGlobal('fetch', vi.fn(async (url: string, options: RequestInit) => {
 chamadas.push({ url, metodo: options.method, body: options.body as string });
 if (options.method === 'POST') return new Response('{}', { status: 201 });
 return new Response(JSON.stringify({ indicadores: { ativos: 1, novosNoMes: 1, retornoAgendado: 0 }, data: url.includes('busca=sem') ? [] : [cliente], meta: { pagina: 1, limite: 10, total: 1, totalPaginas: 1 } }), { status: 200 });
})); });
afterEach(() => vi.unstubAllGlobals());
function montar() { render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><MemoryRouter><ClientesAdministrador /></MemoryRouter></QueryClientProvider>); }
it('consulta dados reais e envia a busca ao servidor', async () => { montar(); expect(await screen.findByText('Maria')).toBeInTheDocument(); await userEvent.type(screen.getByLabelText('Buscar por nome, telefone ou e-mail'), 'sem'); expect(await screen.findByText('Nenhum cliente encontrado.')).toBeInTheDocument(); expect(chamadas.some(c => c.url.includes('busca=sem'))).toBe(true); });
it('cadastra com CPF e senha informados, sem enviar status na criação', async () => { montar(); await userEvent.click(screen.getByText('Novo cliente')); for (const [label, valor] of [['Nome','Ana'], ['E-mail','ana@example.com'], ['CPF','52998224725'], ['Senha','senha-de-teste-comprida']]) await userEvent.type(screen.getByLabelText(label), valor); await userEvent.click(screen.getByText('Salvar')); await screen.findByText('Cliente salvo.'); await waitFor(() => expect(chamadas.some(c => c.metodo === 'POST')).toBe(true)); const payload = JSON.parse(chamadas.find(c => c.metodo === 'POST')!.body!); expect(payload.cpf).toBe('52998224725'); expect(payload.status).toBeUndefined(); });
it('mostra falha HTTP sem convertê-la em lista vazia', async () => { vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 403 })); montar(); expect(await screen.findByText('Você não possui permissão para esta operação.')).toBeInTheDocument(); expect(screen.queryByText('Nenhum cliente encontrado.')).not.toBeInTheDocument(); });
it('abre edição diretamente e preserva dados ao receber conflito', async () => {
 vi.mocked(fetch).mockImplementation(async (url, options) => {
  if (options?.method === 'PATCH') return new Response('{}', { status: 409 });
  if (String(url).endsWith('/clientes/2')) return new Response(JSON.stringify({ cpf: '52998224725', dataNascimento: null, observacao: '', usuario: { nome: 'Maria', email: 'maria@example.com', telefone: null, status: 'ATIVO' } }), { status: 200 });
  return new Response(JSON.stringify({ indicadores: { ativos: 1, novosNoMes: 1, retornoAgendado: 0 }, data: [cliente], meta: { pagina: 1, limite: 10, total: 1, totalPaginas: 1 } }), { status: 200 });
 });
 montar(); await userEvent.click(await screen.findByRole('button', { name: 'Editar Maria' }));
 await screen.findByLabelText('Nova senha (opcional)');
 await userEvent.clear(screen.getByLabelText('Nome')); await userEvent.type(screen.getByLabelText('Nome'), 'Maria Editada');
 await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
 expect(await screen.findByRole('alert')).toHaveTextContent('possui vínculos');
 expect(screen.getByLabelText('Nome')).toHaveValue('Maria Editada');
 expect(screen.getByLabelText('Nova senha (opcional)')).toHaveValue('');
});
