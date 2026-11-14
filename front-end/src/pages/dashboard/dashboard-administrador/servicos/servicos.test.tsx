import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";
const dados = {
  geradoEm: "2026-10-26T15:00:00Z",
  indicadores: { ativos: 2, maisRealizado: "Corte real", ticketMedio: 55 },
  data: [
    {
      id: 9,
      nome: "Corte real",
      duracaoMinutos: 30,
      preco: 55,
      ativo: false,
      realizadosMes: 3,
      receitaMes: 165,
    },
  ],
  meta: { pagina: 1, limite: 12, total: 20, totalPaginas: 2 },
};
let permitido = true,
  falha = false,
  invalida = false,
  vazio = false;
let ativo = false,
  falhaGravacao = false,
  respostaInvalida = false;
let aguardarGravacao: Promise<void> | undefined;
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
  ativo = false;
  falhaGravacao = false;
  respostaInvalida = false;
  aguardarGravacao = undefined;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (entrada: RequestInfo | URL, opcoes?: RequestInit) => {
      const url = new URL(String(entrada));
      if (url.pathname === "/auth/me")
        return json({
          usuario: {
            id: 1,
            nome: "Admin",
            email: "admin@exemplo.com",
            papel: "ADMINISTRADOR",
            permissoes: permitido ? ["GERENCIAR_SERVICOS"] : [],
          },
        });
      if (opcoes?.method === "PATCH") {
        await aguardarGravacao;
        if (falhaGravacao) return json({}, 503);
        const novo = JSON.parse(String(opcoes.body)) as { ativo: boolean };
        if (respostaInvalida) return json({ id: 9, ativo: !novo.ativo });
        ativo = novo.ativo;
        return json({ id: 9, ativo });
      }
      if (falha) return json({}, 503);
      if (invalida) return json({ indicadores: {} });
      return json({
        ...dados,
        meta: { ...dados.meta, pagina: Number(url.searchParams.get('pagina') ?? 1) },
        indicadores: { ...dados.indicadores, ativos: ativo ? 3 : 2 },
        data: vazio ? [] : dados.data.map((item) => ({ ...item, ativo })),
      });
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
function abrir() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  window.history.pushState({}, "", "/admin/servicos");
  render(
    <QueryClientProvider client={client}>
      <App />
    </QueryClientProvider>,
  );
  return client;
}

it("ativa e desativa com payload booleano e revalida os catálogos", async () => {
  const cache = abrir();
  const invalidar = vi.spyOn(cache, "invalidateQueries");
  await userEvent.click(
    await screen.findByRole("button", { name: "Ativar Corte real" }),
  );
  await screen.findByText("Serviço ativado.");
  const botao = await screen.findByRole("button", {
    name: "Desativar Corte real",
  });
  await waitFor(() => expect(botao).toBeEnabled());
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/servicos/9"),
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ ativo: true }),
      credentials: "include",
    }),
  );
  expect(invalidar).toHaveBeenCalledWith({
    queryKey: ["admin", 1, "servicos"],
  });
  expect(invalidar).toHaveBeenCalledWith({ queryKey: ["inicio", "servicos"] });
  expect(invalidar).toHaveBeenCalledWith({ queryKey: ["agendar"] });
  expect(
    within(screen.getByText("Serviços ativos").parentElement!).getByText("3"),
  ).toBeInTheDocument();
  await userEvent.click(botao);
  await screen.findByText(
    "Serviço desativado. Agendamentos existentes foram preservados.",
  );
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/servicos/9"),
    expect.objectContaining({
      method: "PATCH",
      body: JSON.stringify({ ativo: false }),
    }),
  );
  await screen.findByRole("button", { name: "Ativar Corte real" });
});

it("preserva busca e filtro e retorna à primeira página após gravar", async () => {
  abrir();
  await screen.findAllByText("Corte real");
  await userEvent.type(
    screen.getByRole("textbox", { name: "Buscar serviço" }),
    "Corte",
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Status" }),
    "false",
  );
  await userEvent.click(screen.getByRole("button", { name: "Buscar" }));
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  await userEvent.click(
    await screen.findByRole("button", { name: "Ativar Corte real" }),
  );
  await screen.findByText("Serviço ativado.");
  expect(screen.getByRole("textbox", { name: "Buscar serviço" })).toHaveValue(
    "Corte",
  );
  expect(screen.getByRole("combobox", { name: "Status" })).toHaveValue("false");
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/busca=Corte.*ativo=false.*pagina=1/),
      expect.anything(),
    ),
  );
  expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
});

it("bloqueia duplicação durante a gravação", async () => {
  let liberar!: () => void;
  aguardarGravacao = new Promise<void>((resolve) => {
    liberar = resolve;
  });
  abrir();
  const botao = await screen.findByRole("button", {
    name: "Ativar Corte real",
  });
  await userEvent.dblClick(botao);
  expect(botao).toBeDisabled();
  expect(botao).toHaveTextContent("Salvando…");
  expect(
    vi
      .mocked(fetch)
      .mock.calls.filter(([, opcoes]) => opcoes?.method === "PATCH"),
  ).toHaveLength(1);
  liberar();
  await screen.findByText("Serviço ativado.");
});

it.each(["http", "invalida", "rede"])(
  "mantém status anterior e permite nova tentativa após falha %s",
  async (tipo) => {
    falhaGravacao = tipo === "http";
    respostaInvalida = tipo === "invalida";
    abrir();
    const botao = await screen.findByRole("button", {
      name: "Ativar Corte real",
    });
    if (tipo === "rede")
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Falha de rede"));
    await userEvent.click(botao);
    await screen.findByRole("alert");
    expect(
      within(screen.getByRole("table")).getByText("Inativo"),
    ).toBeInTheDocument();
    expect(screen.queryByText("Serviço ativado.")).not.toBeInTheDocument();
    expect(botao).toBeEnabled();
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(([, opcoes]) => opcoes?.method === "PATCH"),
    ).toHaveLength(1);
    falhaGravacao = false;
    respostaInvalida = false;
    await userEvent.click(botao);
    await screen.findByText("Serviço ativado.");
  },
);
it("consulta dados reais mesmo com mocks habilitados", async () => {
  abrir();
  expect((await screen.findAllByText("Corte real")).length).toBeGreaterThan(0);
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/dashboard/administrador/servicos"),
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
    await screen.findByText("Nenhum serviço encontrado."),
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
  await screen.findAllByText("Corte real");
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("pagina=2"),
    expect.anything(),
  );
  await userEvent.type(
    screen.getByRole("textbox", { name: "Buscar serviço" }),
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

function simularFormularioServico(status = 200) {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (entrada, opcoes) => {
    const url = new URL(String(entrada));
    if (url.pathname === '/servicos/9' && opcoes?.method !== 'PATCH') return json({ id: 9, nome: 'Corte real', descricao: 'Descrição atual', precoBase: '55.00', duracaoMinutos: 30, ativo: false });
    if (opcoes?.method === 'POST' || (url.pathname === '/servicos/9' && opcoes?.method === 'PATCH')) {
      if (status !== 200) return json({}, status);
      return json({ id: 9, ...JSON.parse(String(opcoes.body)), ativo: false }, opcoes.method === 'POST' ? 201 : 200);
    }
    return original(entrada, opcoes);
  });
}

it('cria serviço em modal com preço e duração persistidos pelo contrato', async () => {
  simularFormularioServico(); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Novo serviço' }));
  expect(screen.getByRole('dialog', { name: 'Novo serviço' })).toBeInTheDocument();
  await userEvent.type(screen.getByLabelText('Nome'), 'Barba');
  await userEvent.type(screen.getByLabelText('Duração (minutos)'), '25');
  await userEvent.type(screen.getByLabelText('Preço (R$)'), '45.90');
  await userEvent.type(screen.getByLabelText('Descrição (opcional)'), 'Acabamento');
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Serviço salvo.');
  const post = vi.mocked(fetch).mock.calls.find(([, o]) => o?.method === 'POST')!;
  expect(JSON.parse(String(post[1]?.body))).toEqual({ nome: 'Barba', descricao: 'Acabamento', duracaoMinutos: 25, precoBase: 45.9 });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
});

it('edita os detalhes reais sem enviar status e preserva os campos após conflito', async () => {
  simularFormularioServico(409); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Editar Corte real' }));
  const nome = await screen.findByLabelText('Nome');
  expect(nome).toHaveValue('Corte real');
  expect(screen.getByLabelText('Preço (R$)')).toHaveValue(55);
  await userEvent.clear(nome); await userEvent.type(nome, 'Corte atualizado');
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByRole('alert');
  expect(nome).toHaveValue('Corte atualizado');
  expect(screen.getByRole('dialog', { name: 'Editar serviço' })).toBeInTheDocument();
  const patch = vi.mocked(fetch).mock.calls.find(([, o]) => o?.method === 'PATCH')!;
  expect(JSON.parse(String(patch[1]?.body))).not.toHaveProperty('ativo');
});

it('rejeita preço com mais de duas casas e duração fracionada sem gravar', async () => {
  simularFormularioServico(); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Novo serviço' }));
  await userEvent.type(screen.getByLabelText('Nome'), 'Barba');
  await userEvent.type(screen.getByLabelText('Duração (minutos)'), '1.5');
  await userEvent.type(screen.getByLabelText('Preço (R$)'), '1.555');
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  expect(screen.getByText('Use minutos inteiros.')).toBeInTheDocument();
  expect(screen.getByText('Use até duas casas decimais.')).toBeInTheDocument();
  expect(screen.getByLabelText('Duração (minutos)')).toHaveFocus();
  expect(vi.mocked(fetch).mock.calls.some(([, o]) => o?.method === 'POST')).toBe(false);
});

it('salva a edição de serviço com preço alterado e atualiza consultas', async () => {
  simularFormularioServico(); abrir();
  await userEvent.click(await screen.findByRole('button', { name: 'Editar Corte real' }));
  const preco = await screen.findByLabelText('Preço (R$)');
  await userEvent.clear(preco); await userEvent.type(preco, '75.50');
  const antes = vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes('/dashboard/')).length;
  await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
  await screen.findByText('Serviço salvo.');
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  const patch = vi.mocked(fetch).mock.calls.find(([, o]) => o?.method === 'PATCH')!;
  expect(JSON.parse(String(patch[1]?.body))).toMatchObject({ precoBase: 75.5, duracaoMinutos: 30 });
  await waitFor(() => expect(vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes('/dashboard/')).length).toBeGreaterThan(antes));
});
