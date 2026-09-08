import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

function renderizar(caminho: string) {
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

describe("sessão e rotas protegidas", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("restaura a sessão por cookie e permite somente a área do papel", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          usuario: {
            id: 1,
            nome: "Admin",
            email: "admin@exemplo.com",
            papel: "ADMINISTRADOR",
            permissoes: ["GERENCIAR_USUARIOS"],
          },
        }),
        { status: 200 },
      ),
    );
    renderizar("/admin");
    expect(
      await screen.findByRole("heading", { name: "Dashboard administrativo" }),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/me$/),
      expect.objectContaining({ credentials: "include" }),
    );
  });

  it("redireciona um papel autenticado para sua própria área", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify({
          usuario: {
            id: 2,
            nome: "Barbeiro",
            email: "barbeiro@exemplo.com",
            papel: "BARBEIRO",
            permissoes: ["GERENCIAR_PROPRIA_AGENDA"],
          },
        }),
        { status: 200 },
      ),
    );
    renderizar("/admin");
    expect(
      await screen.findByRole("heading", { name: "Olá! 👋" }),
    ).toBeInTheDocument();
    expect(window.location.pathname).toBe("/barbeiro");
  });

  it("redireciona sessão ausente para o login sem usar Web Storage", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "não autenticado" }), {
        status: 401,
      }),
    );
    const armazenamento = vi.spyOn(Storage.prototype, "setItem");
    renderizar("/cliente");
    expect(
      await screen.findByRole("heading", { name: "Entrar" }),
    ).toBeInTheDocument();
    expect(armazenamento).not.toHaveBeenCalled();
  });
});
