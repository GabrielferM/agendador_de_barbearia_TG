import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
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
            permissoes: permitido ? ["GERENCIAR_SERVICOS"] : [],
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
  window.history.pushState({}, "", "/admin/servicos");
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
    screen.getByRole("textbox", { name: "Buscar servico" }),
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
