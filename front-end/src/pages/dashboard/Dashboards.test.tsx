import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../../App";

const base = {
  geradoEm: "2026-09-07T12:00:00.000Z",
  receitaHoje: { valor: 180, variacaoPercentual: 20 },
  servicosNoMes: [{ nome: "Corte", quantidade: 4, percentual: 100 }],
};

function resposta(data: unknown) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function renderizar(caminho: string, papel: "BARBEIRO" | "ADMINISTRADOR") {
  vi.mocked(fetch).mockImplementation((entrada) => {
    const url = String(entrada);
    if (url.endsWith("/auth/me"))
      return Promise.resolve(
        resposta({
          usuario: {
            id: 1,
            nome: "Pessoa Teste",
            email: "pessoa@exemplo.com",
            papel,
            permissoes: [],
          },
        }),
      );
    if (url.endsWith("/dashboard/administrador"))
      return Promise.resolve(
        resposta({
          ...base,
          agendamentosHoje: { valor: 3, variacaoPercentual: 50 },
          clientesAtivos: 12,
          novosClientesNoMes: 2,
          barbeirosAtivos: 4,
          receitaUltimosSeteDias: [],
          desempenhoBarbeiros: [],
          agendamentosRecentes: [],
        }),
      );
    return Promise.resolve(
      resposta({
        ...base,
        atendimentosHoje: { valor: 2, variacaoPercentual: 0 },
        clientesNaSemana: { valor: 5, variacaoPercentual: 25 },
        atendimentosUltimosSeteDias: [],
        agendaHoje: [],
        proximosAgendamentos: [],
      }),
    );
  });
  window.history.pushState({}, "", caminho);
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <App />
    </QueryClientProvider>,
  );
}

describe("dashboards", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "false");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("carrega os indicadores administrativos e oferece navegação para as áreas", async () => {
    renderizar("/admin", "ADMINISTRADOR");
    expect(await screen.findByText("Clientes ativos")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Agendamentos" })).toHaveAttribute(
      "href",
      "/admin/agendamentos",
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/dashboard\/administrador$/),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("carrega apenas a agenda vinculada ao endpoint do barbeiro", async () => {
    renderizar("/barbeiro", "BARBEIRO");
    expect(await screen.findByText("Clientes na semana")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Minha agenda de hoje" }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/dashboard\/barbeiro$/),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("mostra os dados administrativos mockados sem consultar o endpoint", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
    renderizar("/admin", "ADMINISTRADOR");

    expect(await screen.findByText("Dados demonstrativos")).toBeInTheDocument();
    expect(screen.getByText("342")).toBeInTheDocument();
    expect(screen.getByText("Matheus Lima")).toBeInTheDocument();
    expect(screen.getAllByText("07/09").length).toBeGreaterThan(0);
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([entrada]) =>
          String(entrada).includes("/dashboard/"),
        ),
    ).toBe(false);
  });

  it("mostra agenda e próximos horários mockados do barbeiro", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
    renderizar("/barbeiro", "BARBEIRO");

    expect(await screen.findByText("Dados demonstrativos")).toBeInTheDocument();
    expect(screen.getByText("João Oliveira")).toBeInTheDocument();
    expect(screen.getByText("Vinicius Almeida")).toBeInTheDocument();
    expect(screen.getAllByText("08/09").length).toBeGreaterThan(0);
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([entrada]) =>
          String(entrada).includes("/dashboard/"),
        ),
    ).toBe(false);
  });

  it.each([
    ["/admin/agendamentos", "Agendamentos", "Resumo do dia"],
    ["/admin/clientes", "Clientes", "Lista de clientes"],
    ["/admin/barbeiros", "Barbeiros", "Disponibilidade de hoje"],
    ["/admin/servicos", "Serviços", "Catálogo de serviços"],
    ["/admin/financeiro", "Financeiro", "Fluxo financeiro"],
  ])(
    "renderiza a rota administrativa mockada %s",
    async (rota, titulo, conteudo) => {
      vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
      renderizar(rota, "ADMINISTRADOR");
      expect(
        await screen.findByRole("heading", { name: titulo, level: 1 }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: conteudo }),
      ).toBeInTheDocument();
      expect(screen.getByText("Dados demonstrativos")).toBeInTheDocument();
      expect(
        screen.getAllByText(/segunda-feira, 07 de setembro de 2026/i).length,
      ).toBeGreaterThan(0);
      expect(
        vi
          .mocked(fetch)
          .mock.calls.some(([entrada]) =>
            String(entrada).includes("/dashboard/"),
          ),
      ).toBe(false);
    },
  );

  it("navega pela sidebar e destaca a área administrativa atual", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
    renderizar("/admin", "ADMINISTRADOR");
    const link = await screen.findByRole("link", { name: "Clientes" });
    await userEvent.click(link);
    expect(
      await screen.findByRole("heading", { name: "Lista de clientes" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Clientes" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("mantém ações de escrita desabilitadas no exemplo", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
    renderizar("/admin/clientes", "ADMINISTRADOR");
    expect(
      await screen.findByRole("button", {
        name: /Novo cliente.*integração real/,
      }),
    ).toBeDisabled();
  });

  it("mostra indisponibilidade sem consultar APIs quando o modo mock está desligado", async () => {
    renderizar("/admin/financeiro", "ADMINISTRADOR");
    expect(
      await screen.findByText("Área disponível em modo demonstrativo"),
    ).toBeInTheDocument();
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([entrada]) =>
          String(entrada).includes("/dashboard/"),
        ),
    ).toBe(false);
  });

  it("impede que barbeiro acesse uma rota administrativa complementar", async () => {
    renderizar("/admin/clientes", "BARBEIRO");
    expect(
      await screen.findByRole("heading", { name: "Olá! 👋" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/barbeiro");
  });
});
