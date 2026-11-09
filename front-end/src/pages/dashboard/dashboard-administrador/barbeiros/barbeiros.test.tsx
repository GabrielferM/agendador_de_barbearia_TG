import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";
const dados = {
  geradoEm: "2026-10-26T15:00:00Z",
  indicadores: { ativos: 2, atendimentosMes: 3, comissoesAPagar: 20 },
  data: [
    {
      id: 9,
      nome: "Profissional real",
      filial: "Centro",
      status: "AFASTADO",
      statusConta: "ATIVO",
      atendimentosHoje: 2,
      receitaMes: 100,
      comissoesRegistradasMes: 30,
      comissoesAPagar: 20,
    },
  ],
  meta: { pagina: 1, limite: 12, total: 20, totalPaginas: 2 },
};
let permitido = true,
  falha = false,
  invalida = false,
  vazio = false;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
beforeEach(() => {
  permitido = true;
  falha = false;
  invalida = false;
  vazio = false;
  vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
  vi.stubGlobal(
    "fetch",
    vi.fn(async (entrada: RequestInfo | URL) => {
      const url = new URL(String(entrada));
      if (url.pathname === "/auth/me")
        return json({
          usuario: {
            id: 1,
            nome: "Admin",
            email: "admin@exemplo.com",
            papel: "ADMINISTRADOR",
            permissoes: permitido ? ["GERENCIAR_USUARIOS"] : [],
          },
        });
      if (falha) return json({}, 503);
      if (invalida) return json({ indicadores: {} });
      return json({ ...dados, data: vazio ? [] : dados.data, meta: { ...dados.meta, pagina: Number(url.searchParams.get('pagina') ?? 1) } });
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
function abrir() {
  window.history.pushState({}, "", "/admin/barbeiros");
  render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <App />
    </QueryClientProvider>,
  );
}
it("consulta dados reais mesmo com mocks habilitados", async () => {
  abrir();
  expect(
    (await screen.findAllByText("Profissional real")).length,
  ).toBeGreaterThan(0);
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/dashboard/administrador/barbeiros"),
    expect.objectContaining({
      credentials: "include",
      signal: expect.any(AbortSignal),
    }),
  );
});
it("distingue vazio e erro e permite tentar novamente sem fallback", async () => {
  falha = true;
  abrir();
  await screen.findByRole("button", { name: "Tentar novamente" });
  falha = false;
  vazio = true;
  await userEvent.click(
    screen.getByRole("button", { name: "Tentar novamente" }),
  );
  expect(
    await screen.findByText("Nenhum barbeiro encontrado."),
  ).toBeInTheDocument();
});
it("rejeita uma resposta malformada", async () => {
  invalida = true;
  abrir();
  expect(
    await screen.findByRole("button", { name: "Tentar novamente" }),
  ).toBeInTheDocument();
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
});
it("não consulta dados sem permissão", async () => {
  permitido = false;
  abrir();
  await screen.findByRole("alert");
  expect(
    vi
      .mocked(fetch)
      .mock.calls.some(([url]) => String(url).includes("/dashboard/")),
  ).toBe(false);
});
it("envia paginação e filtros ao servidor", async () => {
  abrir();
  await screen.findAllByText("Profissional real");
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("pagina=2"),
    expect.anything(),
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Buscar barbeiro" }),
    "API",
  );
  expect(fetch).not.toHaveBeenLastCalledWith(expect.stringContaining("busca=API"), expect.anything());
  await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("busca=API"),
    expect.anything(),
  );
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("pagina=1"),
    expect.anything(),
  );
});

function simularCadastro(status = 201, filiais = [{ id: 3, nome: "Centro" }]) {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (entrada, opcoes) => {
    const url = new URL(String(entrada));
    if (url.pathname === "/publico/filiais") return json({ data: filiais, meta: { pagina: 1, limite: 100, total: filiais.length, totalPaginas: 1 } });
    if (url.pathname === "/barbeiros" && opcoes?.method === "POST") return json(status === 201 ? { id: 9, usuario: { id: 9, status: 'ATIVO' } } : {}, status);
    return original(entrada, opcoes);
  });
}

async function preencherCadastro() {
  await userEvent.click(await screen.findByRole("button", { name: "Novo barbeiro" }));
  await screen.findByLabelText("Filial");
  await userEvent.type(screen.getByLabelText("Nome", { exact: true }), "Ana Silva");
  await userEvent.type(screen.getByLabelText("E-mail"), "ana@example.com");
  await userEvent.type(screen.getByLabelText("Senha (15 a 128 caracteres)"), "  frase de teste longa  ");
}

it("cria a conta com filial e senha preservada e atualiza a lista", async () => {
  simularCadastro();
  abrir();
  await screen.findAllByText("Profissional real");
  await preencherCadastro();
  expect(screen.getByLabelText("Filial")).toHaveValue("3");
  const consultasAntes = vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes("/dashboard/")).length;
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
  await screen.findByText(/Conta de barbeiro criada/);
  const envios = vi.mocked(fetch).mock.calls.filter(([, opcoes]) => opcoes?.method === "POST");
  expect(envios).toHaveLength(1);
  expect(JSON.parse(String(envios[0][1]?.body))).toEqual({ nome: "Ana Silva", email: "ana@example.com", senha: "  frase de teste longa  ", idFilial: 3 });
  expect(envios[0][1]?.credentials).toBe("include");
  expect(screen.queryByRole("form")).not.toBeInTheDocument();
  await waitFor(() => expect(vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes("/dashboard/")).length).toBeGreaterThan(consultasAntes));
});

it("preserva os campos após conflito e permite fechar sem criar conta", async () => {
  simularCadastro(409);
  abrir();
  await preencherCadastro();
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
  await screen.findByText("O registro mudou, já existe ou possui vínculos que impedem esta operação.");
  expect(screen.getByLabelText("Nome", { exact: true })).toHaveValue("Ana Silva");
  expect(screen.getByLabelText("Senha (15 a 128 caracteres)")).toHaveValue("  frase de teste longa  ");
  await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));
  await userEvent.click(screen.getByRole("button", { name: "Descartar alterações" }));
  await waitFor(() => expect(screen.queryByRole("form")).not.toBeInTheDocument());
  expect(vi.mocked(fetch).mock.calls.filter(([, opcoes]) => opcoes?.method === "POST")).toHaveLength(1);
});

it("impede cadastro quando não há filial ativa", async () => {
  simularCadastro(201, []);
  abrir();
  await userEvent.click(await screen.findByRole("button", { name: "Novo barbeiro" }));
  await screen.findByText(/Nenhuma filial ativa disponível/);
  expect(screen.queryByRole("button", { name: "Salvar" })).not.toBeInTheDocument();
  expect(vi.mocked(fetch).mock.calls.some(([, opcoes]) => opcoes?.method === "POST")).toBe(false);
});

it("bloqueia envios duplicados enquanto o cadastro está pendente", async () => {
  simularCadastro();
  const original = vi.mocked(fetch).getMockImplementation()!;
  let concluir!: (resposta: Response) => void;
  vi.mocked(fetch).mockImplementation((entrada, opcoes) => {
    if (opcoes?.method === "POST") return new Promise<Response>(resolve => { concluir = resolve; });
    return original(entrada, opcoes);
  });
  abrir();
  await preencherCadastro();
  await userEvent.click(screen.getByRole("button", { name: "Salvar" }));
  expect(screen.getByRole("button", { name: "Salvando…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Salvando…" }));
  expect(vi.mocked(fetch).mock.calls.filter(([, opcoes]) => opcoes?.method === "POST")).toHaveLength(1);
  concluir(json({ id: 9, usuario: { id: 9, status: 'ATIVO' } }, 201));
  await screen.findByText(/Conta de barbeiro criada/);
});

it("carrega todas as páginas de filiais e exige seleção quando há mais de uma", async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (entrada, opcoes) => {
    const url = new URL(String(entrada));
    if (url.pathname === "/publico/filiais") {
      const pagina = Number(url.searchParams.get("pagina"));
      return json({ data: [{ id: pagina, nome: pagina === 1 ? "Centro" : "Bairro" }], meta: { pagina, limite: 100, total: 2, totalPaginas: 2 } });
    }
    return original(entrada, opcoes);
  });
  abrir();
  await userEvent.click(await screen.findByRole("button", { name: "Novo barbeiro" }));
  const filial = await screen.findByLabelText("Filial");
  expect(filial).toHaveValue("");
  expect(filial).toBeRequired();
  expect(screen.getByRole("option", { name: "Bairro" })).toBeInTheDocument();
  await userEvent.selectOptions(filial, "2");
  expect(filial).toHaveValue("2");
});

function simularEdicao(falhar = false) {
  const original = vi.mocked(fetch).getMockImplementation()!;
  let statusConta = 'ATIVO';
  vi.mocked(fetch).mockImplementation(async (entrada, opcoes) => {
    const url = new URL(String(entrada));
    if (url.pathname === '/publico/filiais') return json({ data: [{ id: 3, nome: 'Centro' }], meta: { pagina: 1, limite: 100, total: 1, totalPaginas: 1 } });
    if (url.pathname === '/barbeiros/9') {
      if (opcoes?.method === 'PATCH') {
        if (falhar) return json({}, 409);
        const payload = JSON.parse(String(opcoes.body));
        statusConta = payload.statusConta ?? statusConta;
        return json({ id: 9, usuario: { id: 9, status: statusConta } });
      }
      return json({ id: 9, idFilial: 4, filial: { id: 4, nome: 'Unidade antiga' }, usuario: { id: 9, nome: 'Ana Silva', email: 'ana@example.com', status: statusConta }, nomeProfissional: 'Ana', descricao: 'Perfil atual', fotoUrl: null, dataAdmissao: null, statusProfissional: 'AFASTADO' });
    }
    if (url.pathname === '/dashboard/administrador/barbeiros') return json({ ...dados, data: dados.data.map((b) => ({ ...b, statusConta })) });
    return original(entrada, opcoes);
  });
}

it('edita conta e perfil em modal com filial atual inativa e sem preencher senha', async () => {
  simularEdicao(); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Editar Profissional real' }));
  await screen.findByRole('dialog', { name: 'Editar barbeiro' });
  const nome = await screen.findByRole('textbox', { name: 'Nome' });
  expect(nome).toHaveValue('Ana Silva');
  expect(screen.getByLabelText('Nova senha (opcional)')).toHaveValue('');
  expect(screen.getByLabelText('Filial')).toHaveValue('4');
  expect(within(screen.getByRole('dialog')).getByLabelText('Status profissional')).toHaveValue('AFASTADO');
  await userEvent.clear(nome); await userEvent.type(nome, 'Ana Atualizada');
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Barbeiro atualizado.');
  const patch = vi.mocked(fetch).mock.calls.find(([, o]) => o?.method === 'PATCH')!;
  expect(String(patch[0])).toContain('/barbeiros/9');
  expect(JSON.parse(String(patch[1]?.body))).toMatchObject({ nome: 'Ana Atualizada', email: 'ana@example.com', idFilial: 4, statusProfissional: 'AFASTADO' });
  expect(JSON.parse(String(patch[1]?.body))).not.toHaveProperty('senha');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('inativa e reativa a conta com confirmação e preserva status profissional', async () => {
  simularEdicao(); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Inativar conta de Profissional real' }));
  expect(screen.getByRole('dialog', { name: 'Inativar conta de Profissional real?' })).toBeInTheDocument();
  expect(vi.mocked(fetch).mock.calls.some(([, o]) => o?.method === 'PATCH')).toBe(false);
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));
  await screen.findByText(/Conta inativada/);
  await userEvent.click(await screen.findByRole('button', { name: 'Reativar conta de Profissional real' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));
  await screen.findByText('Conta reativada.');
  const patches = vi.mocked(fetch).mock.calls.filter(([, o]) => o?.method === 'PATCH');
  expect(patches.map(([, o]) => JSON.parse(String(o?.body)))).toEqual([{ statusConta: 'INATIVO' }, { statusConta: 'ATIVO' }]);
  expect(screen.getAllByText('Afastado').length).toBeGreaterThan(0);
});

it('mantém confirmação de status aberta em conflito e não exclui a conta', async () => {
  simularEdicao(true); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Inativar conta de Profissional real' }));
  await userEvent.click(screen.getByRole('button', { name: 'Confirmar alteração' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('dialog')).toHaveAccessibleName('Inativar conta de Profissional real?');
  expect(vi.mocked(fetch).mock.calls.some(([, o]) => o?.method === 'DELETE')).toBe(false);
});

it('protege alterações ao cancelar e reabre criação limpa após descarte', async () => {
  simularCadastro(); abrir(); await preencherCadastro();
  await userEvent.keyboard('{Escape}');
  expect(await screen.findByRole('dialog', { name: 'Descartar alterações?' })).toBeInTheDocument();
  await userEvent.click(screen.getByRole('button', { name: 'Continuar editando' }));
  expect(screen.getByLabelText('Nome', { exact: true })).toHaveValue('Ana Silva');
  await userEvent.click(screen.getByRole('button', { name: 'Cancelar' }));
  await userEvent.click(screen.getByRole('button', { name: 'Descartar alterações' }));
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
  const novo = screen.getByRole('button', { name: 'Novo barbeiro' });
  await waitFor(() => expect(novo).toHaveFocus());
  await userEvent.click(novo);
  expect(await screen.findByLabelText('Nome', { exact: true })).toHaveValue('');
  expect(screen.getByLabelText('Senha (15 a 128 caracteres)')).toHaveValue('');
});
