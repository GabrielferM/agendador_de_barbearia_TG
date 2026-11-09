import { act, render, screen, waitFor, within, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { ClientesAdministrador } from './index';
vi.mock('../../../../auth/contexto-autenticacao', () => ({
  useAutenticacao: () => ({
    usuario: { id: 1, nome: 'Admin', papel: 'ADMINISTRADOR', permissoes: ['GERENCIAR_USUARIOS'] },
    logout: vi.fn(),
  }),
}));
const cliente = {
  id: 2,
  nome: 'Maria',
  email: 'maria@example.com',
  telefone: null,
  status: 'ATIVO',
  ultimoAtendimento: null,
  proximoHorario: null,
};
const chamadas: { url: string; metodo?: string; body?: string }[] = [];
beforeEach(() => {
  chamadas.length = 0;
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string, options: RequestInit) => {
      chamadas.push({ url, metodo: options.method, body: options.body as string });
      if (options.method === 'POST') return new Response('{}', { status: 201 });
      return new Response(
        JSON.stringify({
          indicadores: { ativos: 1, novosNoMes: 1, retornoAgendado: 0 },
          data: url.includes('busca=sem') ? [] : [cliente],
          meta: { pagina: 1, limite: 10, total: 1, totalPaginas: 1 },
        }),
        { status: 200 },
      );
    }),
  );
});
afterEach(() => vi.unstubAllGlobals());
function montar() {
  render(
    <QueryClientProvider
      client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
    >
      <MemoryRouter>
        <ClientesAdministrador />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
it('consulta dados reais e envia a busca ao servidor', async () => {
  montar();
  expect(await screen.findByText('Maria')).toBeInTheDocument();
  await userEvent.type(screen.getByLabelText('Buscar por nome, telefone ou e-mail'), 'sem');
  expect(chamadas.filter((c) => c.url.includes('/dashboard/'))).toHaveLength(1);
  await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  expect(await screen.findByText('Nenhum cliente encontrado.')).toBeInTheDocument();
  expect(chamadas.some((c) => c.url.includes('busca=sem'))).toBe(true);
});

it('aplica texto e status juntos por Enter, permite repetir e limpar a busca', async () => {
  montar();
  await screen.findByText('Maria');
  const campo = screen.getByLabelText('Buscar por nome, telefone ou e-mail');
  await userEvent.type(campo, 'Maria');
  await userEvent.selectOptions(screen.getByLabelText('Status'), 'INATIVO');
  expect(chamadas).toHaveLength(1);
  await userEvent.type(campo, '{Enter}');
  await waitFor(() => expect(chamadas).toHaveLength(2));
  expect(chamadas[1].url).toMatch(/busca=Maria.*status=INATIVO.*pagina=1/);
  expect(campo).toHaveFocus();
  await waitFor(() => expect(screen.getByRole('button', { name: 'Buscar' })).toBeEnabled());
  await userEvent.click(screen.getByRole('button', { name: 'Buscar' }));
  await waitFor(() => expect(chamadas).toHaveLength(3));
  await userEvent.clear(campo);
  await userEvent.type(campo, '{Enter}');
  await waitFor(() => expect(chamadas).toHaveLength(4));
  expect(new URL(chamadas[3].url).searchParams.get('busca')).toBe('');
});

it('preserva itens, foco e indicadores durante busca lenta, falha e recuperação', async () => {
  montar();
  const item = await screen.findByText('Maria');
  const tabela = screen.getByRole('table');
  const indicadores = screen.getByText('Clientes ativos');
  let concluir!: (resposta: Response) => void;
  vi.mocked(fetch).mockImplementationOnce(() => new Promise<Response>((resolve) => { concluir = resolve; }));
  const campo = screen.getByLabelText('Buscar por nome, telefone ou e-mail');
  await userEvent.type(campo, 'sem{Enter}');
  await screen.findByText('Atualizando resultados…');
  expect(screen.getByRole('table')).toBe(tabela);
  expect(item).toBeInTheDocument();
  expect(indicadores).toBeInTheDocument();
  expect(campo).toHaveFocus();
  expect(screen.getByRole('button', { name: 'Buscar' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Próxima' })).toBeDisabled();
  expect(screen.getByLabelText('Resultados da consulta')).toHaveAttribute('aria-busy', 'true');
  await userEvent.type(campo, ' rascunho{Enter}');
  expect(campo).toHaveValue('sem rascunho');
  await act(async () => concluir(new Response('{}', { status: 503 })));
  await screen.findByText(/Os dados exibidos são da última consulta concluída/);
  expect(screen.getByRole('table')).toBe(tabela);
  expect(item).toBeInTheDocument();
  expect(campo).toHaveValue('sem rascunho');
  await userEvent.click(screen.getByRole('button', { name: 'Tentar novamente' }));
  await screen.findByText('Nenhum cliente encontrado.');
  expect(campo).toHaveValue('sem rascunho');
  expect(chamadas.at(-1)?.url).toContain('busca=sem&');
});

it('pagina com filtros aplicados, preserva rascunho e números da página visível', async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    const pagina = Number(new URL(String(args[0])).searchParams.get('pagina'));
    const resposta = await original(...args);
    const corpo = await resposta.json();
    return new Response(JSON.stringify({ ...corpo, meta: { pagina, total: 30, limite: 10, totalPaginas: 3 } }));
  });
  montar();
  await screen.findByText('Maria');
  const campo = screen.getByLabelText('Buscar por nome, telefone ou e-mail');
  await userEvent.type(campo, 'Maria{Enter}');
  await waitFor(() => expect(screen.getByRole('button', { name: 'Buscar' })).toBeEnabled());
  await userEvent.clear(campo);
  await userEvent.type(campo, 'rascunho');
  let concluir!: (resposta: Response) => void;
  vi.mocked(fetch).mockImplementationOnce((url) => {
    chamadas.push({ url: String(url) });
    return new Promise<Response>((resolve) => { concluir = resolve; });
  });
  await userEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  expect(chamadas.at(-1)?.url).toMatch(/busca=Maria.*pagina=2/);
  expect(screen.getByText('Página 1 de 3')).toBeInTheDocument();
  expect(campo).toHaveValue('rascunho');
  await act(async () => concluir(new Response(JSON.stringify({
    indicadores: { ativos: 1, novosNoMes: 1, retornoAgendado: 0 }, data: [cliente],
    meta: { pagina: 2, limite: 10, total: 30, totalPaginas: 3 },
  }))));
  await screen.findByText('Página 2 de 3');
  expect(campo).toHaveValue('rascunho');
});
it('cadastra com CPF e senha informados, sem enviar status na criação', async () => {
  montar();
  await userEvent.click(screen.getByText('Novo cliente'));
  for (const [label, valor] of [
    ['Nome', 'Ana'],
    ['E-mail', 'ana@example.com'],
    ['CPF', '52998224725'],
    ['Senha', 'senha-de-teste-comprida'],
  ])
    await userEvent.type(screen.getByLabelText(label), valor);
  await userEvent.click(screen.getByText('Salvar'));
  await screen.findByText('Cliente salvo.');
  await waitFor(() => expect(chamadas.some((c) => c.metodo === 'POST')).toBe(true));
  const payload = JSON.parse(chamadas.find((c) => c.metodo === 'POST')!.body!);
  expect(payload.cpf).toBe('52998224725');
  expect(payload.status).toBeUndefined();
});
it('mostra falha HTTP sem convertê-la em lista vazia', async () => {
  vi.mocked(fetch).mockResolvedValue(new Response('{}', { status: 403 }));
  montar();
  expect(
    await screen.findByText('Você não possui permissão para esta operação.'),
  ).toBeInTheDocument();
  expect(screen.queryByText('Nenhum cliente encontrado.')).not.toBeInTheDocument();
});

it('confirma antes de excluir, permite cancelar e preserva bloqueio por vínculos', async () => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
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
  expect(chamadas.some((c) => c.metodo === 'DELETE')).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Excluir Maria' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  expect(
    await screen.findByText(
      'O registro mudou, já existe ou possui vínculos que impedem esta operação.',
    ),
  ).toBeInTheDocument();
  expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  expect(screen.getByText(/Para preservar o cadastro, edite o status/)).toBeInTheDocument();
  vi.restoreAllMocks();
});

it('abre detalhes, edita status e preserva dados do formulário após falha', async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    const url = String(args[0]);
    if (url.endsWith('/clientes/2') && args[1]?.method === 'GET')
      return new Response(
        JSON.stringify({
          cpf: '52998224725',
          usuario: { nome: 'Maria', email: 'maria@example.com', telefone: null, status: 'ATIVO' },
          observacao: null,
          diaAniversario: null,
          mesAniversario: null,
        }),
        { status: 200 },
      );
    if (args[1]?.method === 'PATCH') return new Response('{}', { status: 400 });
    return original(...args);
  });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Visualizar Maria' }));
  expect(await screen.findByLabelText('Nome')).toHaveValue('Maria');
  await userEvent.click(screen.getByRole('button', { name: 'Editar cliente' }));
  await userEvent.selectOptions(
    within(screen.getByRole('form')).getByLabelText('Status'),
    'INATIVO',
  );
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  expect(
    await screen.findByText('Revise os campos e as regras desta operação.'),
  ).toBeInTheDocument();
  expect(screen.getByLabelText('Nome')).toHaveValue('Maria');
  expect(within(screen.getByRole('form')).getByLabelText('Status')).toHaveValue('INATIVO');
});

it('exclui somente após confirmar e reconsulta a lista', async () => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value: function (this: HTMLDialogElement) {
      this.setAttribute('open', '');
    },
  });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Excluir Maria' }));
  const consultasAntes = chamadas.filter((c) => c.url.includes('/dashboard/')).length;
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  expect(await screen.findByText('Cliente excluído.')).toBeInTheDocument();
  expect(chamadas.filter((c) => c.metodo === 'DELETE')).toHaveLength(1);
  expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  await waitFor(() =>
    expect(chamadas.filter((c) => c.url.includes('/dashboard/')).length).toBeGreaterThan(
      consultasAntes,
    ),
  );
});

it('mostra erro por campo ao sair, revalida e serializa máscaras e aniversário', async () => {
  montar();
  await userEvent.click(screen.getByRole('button', { name: 'Novo cliente' }));
  const campoCpf = screen.getByLabelText('CPF');
  fireEvent.change(campoCpf, { target: { value: '00000000000' } });
  fireEvent.blur(campoCpf);
  expect(campoCpf).toHaveAttribute('aria-invalid', 'true');
  expect(screen.getByText('Informe um CPF válido.')).toHaveAttribute(
    'id',
    campoCpf.getAttribute('aria-describedby'),
  );
  fireEvent.change(campoCpf, { target: { value: '529.982.247-25' } });
  expect(campoCpf).toHaveValue('529.982.247-25');
  expect(campoCpf).toHaveAttribute('aria-invalid', 'false');
  for (const [rotulo, valor] of [
    ['Nome', ' Ana '],
    ['E-mail', ' ANA@EXAMPLE.COM '],
    ['Telefone', '(11) 99999-4444'],
    ['Senha', ' senha longa segura '],
    ['Dia do aniversário (opcional)', '29'],
  ])
    fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
  fireEvent.change(screen.getByLabelText('Mês do aniversário (opcional)'), {
    target: { value: '2' },
  });
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Cliente salvo.');
  const payload = JSON.parse(chamadas.find((c) => c.metodo === 'POST')!.body!);
  expect(payload).toMatchObject({
    nome: 'Ana',
    email: 'ana@example.com',
    cpf: '52998224725',
    telefone: '11999994444',
    diaAniversario: 29,
    mesAniversario: 2,
    senha: ' senha longa segura ',
  });
  expect(payload).not.toHaveProperty('dataNascimento');
});

it('bloqueia CPF e aniversário inválidos sem fazer POST e foca o primeiro erro', async () => {
  montar();
  await userEvent.click(screen.getByRole('button', { name: 'Novo cliente' }));
  for (const [rotulo, valor] of [
    ['Nome', 'Ana'],
    ['E-mail', 'ana@example.com'],
    ['CPF', '00000000000'],
    ['Senha', ' senha longa segura '],
    ['Dia do aniversário (opcional)', '31'],
  ])
    fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
  fireEvent.change(screen.getByLabelText('Mês do aniversário (opcional)'), {
    target: { value: '4' },
  });
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  expect(screen.getByLabelText('CPF')).toHaveFocus();
  expect(screen.getByLabelText('Dia do aniversário (opcional)')).toHaveAttribute(
    'aria-invalid',
    'true',
  );
  expect(chamadas.some((c) => c.metodo === 'POST')).toBe(false);
});

it('permite remover aniversário na edição e omite senha vazia', async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    if (String(args[0]).endsWith('/clientes/2') && args[1]?.method === 'GET')
      return new Response(
        JSON.stringify({
          cpf: '52998224725',
          diaAniversario: 29,
          mesAniversario: 2,
          observacao: null,
          usuario: {
            nome: 'Maria',
            email: 'maria@example.com',
            telefone: '1133334444',
            status: 'ATIVO',
          },
        }),
        { status: 200 },
      );
    if (args[1]?.method === 'PATCH') {
      chamadas.push({ url: String(args[0]), metodo: 'PATCH', body: args[1].body as string });
      return new Response('{}', { status: 200 });
    }
    return original(...args);
  });
  montar();
  await userEvent.click(await screen.findByRole('button', { name: 'Visualizar Maria' }));
  expect(await screen.findByLabelText('CPF')).toHaveValue('529.982.247-25');
  expect(screen.getByLabelText('Telefone')).toHaveValue('(11) 3333-4444');
  await userEvent.click(screen.getByRole('button', { name: 'Editar cliente' }));
  fireEvent.change(screen.getByLabelText('Dia do aniversário (opcional)'), {
    target: { value: '' },
  });
  fireEvent.change(screen.getByLabelText('Mês do aniversário (opcional)'), {
    target: { value: '' },
  });
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Cliente salvo.');
  const payload = JSON.parse(chamadas.find((c) => c.metodo === 'PATCH')!.body!);
  expect(payload).toMatchObject({
    diaAniversario: null,
    mesAniversario: null,
    telefone: '1133334444',
  });
  expect(payload).not.toHaveProperty('senha');
});

it('impede envio duplicado enquanto a gravação está pendente', async () => {
  let concluir!: (resposta: Response) => void;
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (...args) => {
    if (args[1]?.method === 'POST') {
      chamadas.push({ url: String(args[0]), metodo: 'POST' });
      return new Promise<Response>((resolve) => {
        concluir = resolve;
      });
    }
    return original(...args);
  });
  montar();
  await userEvent.click(screen.getByRole('button', { name: 'Novo cliente' }));
  for (const [rotulo, valor] of [
    ['Nome', 'Ana'],
    ['E-mail', 'ana@example.com'],
    ['CPF', '52998224725'],
    ['Senha', 'senha longa segura'],
  ])
    fireEvent.change(screen.getByLabelText(rotulo), { target: { value: valor } });
  const formulario = screen.getByRole('form');
  fireEvent.submit(formulario);
  fireEvent.submit(formulario);
  await waitFor(() => expect(chamadas.filter((c) => c.metodo === 'POST')).toHaveLength(1));
  expect(screen.getByRole('button', { name: 'Salvando…' })).toBeDisabled();
  concluir(new Response('{}', { status: 201 }));
  await screen.findByText('Cliente salvo.');
});
