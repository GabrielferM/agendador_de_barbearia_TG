import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
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
      return json(vazio ? { ...dados, data: [] } : dados);
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
    if (url.pathname === "/barbeiros" && opcoes?.method === "POST") return json({}, status);
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
  await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
  expect(screen.queryByRole("form")).not.toBeInTheDocument();
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
  expect(screen.getByRole("button", { name: "Fechar" })).toBeDisabled();
  await userEvent.click(screen.getByRole("button", { name: "Salvando…" }));
  expect(vi.mocked(fetch).mock.calls.filter(([, opcoes]) => opcoes?.method === "POST")).toHaveLength(1);
  concluir(json({}, 201));
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
