import { render, screen, waitFor, within } from '@testing-library/react';
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

it('confirma antes de excluir, permite cancelar e preserva bloqueio por vínculos', async () => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    if (args[1]?.method === 'DELETE') {
      chamadas.push({ url: String(args[0]), metodo: 'DELETE' });
      return new Response('{}', { status: 409 });
    }
    return original(...args);
  });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Excluir Maria' }));
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  expect(chamadas.some(c => c.metodo === 'DELETE')).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Excluir Maria' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  expect(await screen.findByText('O registro mudou, já existe ou possui vínculos que impedem esta operação.')).toBeInTheDocument();
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  expect(screen.getByText(/Para preservar o cadastro, edite o status/)).toBeInTheDocument();
  vi.restoreAllMocks();
});

it('abre detalhes, edita status e preserva dados do formulário após falha', async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    const url = String(args[0]);
    if (url.endsWith('/clientes/2') && args[1]?.method === 'GET') return new Response(JSON.stringify({ cpf: '52998224725', usuario: { nome: 'Maria', email: 'maria@example.com', telefone: null, status: 'ATIVO' }, observacao: null, dataNascimento: null }), { status: 200 });
    if (args[1]?.method === 'PATCH') return new Response('{}', { status: 400 });
    return original(...args);
  });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Visualizar Maria' }));
  expect(await screen.findByLabelText('Nome')).toHaveValue('Maria');
  await userEvent.click(screen.getByRole('button', { name: 'Editar cliente' }));
  await userEvent.selectOptions(within(screen.getByRole('form')).getByRole('combobox'), 'INATIVO');
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  expect(await screen.findByText('Revise os campos e as regras desta operação.')).toBeInTheDocument();
  expect(screen.getByLabelText('Nome')).toHaveValue('Maria');
  expect(within(screen.getByRole('form')).getByRole('combobox')).toHaveValue('INATIVO');
});

it('exclui somente após confirmar e reconsulta a lista', async () => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: function (this: HTMLDialogElement) { this.setAttribute('open', ''); } });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Excluir Maria' }));
  const consultasAntes = chamadas.filter(c => c.url.includes('/dashboard/')).length;
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  expect(await screen.findByText('Cliente excluído.')).toBeInTheDocument();
  expect(chamadas.filter(c => c.metodo === 'DELETE')).toHaveLength(1);
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  await waitFor(() => expect(chamadas.filter(c => c.url.includes('/dashboard/')).length).toBeGreaterThan(consultasAntes));
});
