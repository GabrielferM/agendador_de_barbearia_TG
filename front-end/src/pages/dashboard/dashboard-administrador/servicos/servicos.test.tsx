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
  vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
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
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("busca=API"),
    expect.anything(),
  );
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("pagina=1"),
    expect.anything(),
  );
});
