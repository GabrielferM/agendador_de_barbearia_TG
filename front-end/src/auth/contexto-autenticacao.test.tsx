import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

function renderizar(caminho: string) {
  window.history.pushState({}, "", caminho);
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const resultado = render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  );
  return { ...resultado, queryClient };
}

describe("sessão e rotas protegidas", () => {
  beforeEach(() => vi.stubGlobal("fetch", vi.fn()));
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
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

  it("limpa dados privados e avisa quando o logout remoto não é confirmado", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
    vi.mocked(fetch)
      .mockResolvedValueOnce(
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
      )
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "falha" }), { status: 503 }));
    const { queryClient } = renderizar("/admin");
    queryClient.setQueryData(["privado"], { segredo: true });

    await userEvent.click(await screen.findByRole("button", { name: "Sair" }));

    expect(
      await screen.findByText(/não foi possível confirmar o encerramento no servidor/i),
    ).toBeInTheDocument();
    await waitFor(() => expect(queryClient.getQueryData(["privado"])).toBeUndefined());
    expect(window.location.pathname).toBe("/login");
  });

  it("encerra localmente uma sessão expirada sem chamar logout", async () => {
    vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "false");
    vi.mocked(fetch)
      .mockResolvedValueOnce(
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
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ message: "sessão expirada" }), { status: 401 }),
      );

    renderizar("/admin");

    expect(await screen.findByRole("heading", { name: "Entrar" })).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledTimes(2);
    expect(
      vi.mocked(fetch).mock.calls.some(([entrada]) => String(entrada).endsWith("/auth/logout")),
    ).toBe(false);
  });
});
