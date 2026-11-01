import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import App from "../../../App";
import { validarFiltros } from "./periodo-barbeiro";
const item = {
  id: 1,
  inicioPrevisto: "2026-10-31T12:00:00Z",
  fimPrevisto: "2026-10-31T13:00:00Z",
  status: "CONFIRMADO",
  cliente: { id: 7, nome: "Cliente próprio" },
  filial: {
    id: 1,
    nome: "Centro",
    endereco: {
      logradouro: "Rua A",
      numero: "1",
      bairro: "Centro",
      cidade: "Franca",
      estado: "SP",
    },
  },
  barbeiro: { id: 2, nomeProfissional: "Barbeiro" },
  servicos: [
    {
      idServico: 1,
      precoAplicado: "30.00",
      subtotal: "60.00",
      quantidade: 2,
      duracaoAplicadaMinutos: 30,
      servico: { id: 1, nome: "Corte" },
    },
  ],
};
const meta = { pagina: 1, limite: 10, total: 1, totalPaginas: 1 };
let statusHttp = 200,
  vazio = false,
  permissao = true;
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
function abrir(caminho: string) {
  window.history.pushState({}, "", caminho);
  const cache = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={cache}>
      <App />
    </QueryClientProvider>,
  );
  return cache;
}
beforeEach(() => {
  statusHttp = 200;
  vazio = false;
  permissao = true;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input, options) => {
      const url = new URL(String(input), "http://localhost:3000");
      if (url.pathname === "/auth/me")
        return json({
          usuario: {
            id: 2,
            nome: "Profissional",
            email: "teste@local",
            papel: "BARBEIRO",
            permissoes: permissao ? ["GERENCIAR_PROPRIA_AGENDA"] : [],
          },
        });
      if (statusHttp !== 200) return json({}, statusHttp);
      if (options?.method === "PATCH")
        return json({
          ...item,
          status: "CANCELADO",
          motivoCancelamento: "Compromisso",
        });
      if (/\/agendamentos\/\d+$/.test(url.pathname)) return json(item);
      const data = vazio
        ? []
        : url.pathname.endsWith("/clientes")
          ? [
              {
                id: 7,
                nome: "Cliente próprio",
                ultimoAtendimento: null,
                proximoAgendamento: null,
                atendimentosConcluidos: 3,
              },
            ]
          : url.pathname.endsWith("/servicos")
            ? [
                {
                  id: 1,
                  nome: "Corte",
                  descricao: null,
                  ativo: true,
                  precoBase: "45.00",
                  duracaoMinutos: 30,
                  quantidade: 2,
                  receita: "60.00",
                },
              ]
            : [item];
      return json({
        data,
        meta: vazio ? { ...meta, total: 0, totalPaginas: 0 } : meta,
      });
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("área do barbeiro integrada", () => {
  it.each([
    ["servicos", "Meus serviços"],
    ["clientes", "Clientes"],
    ["historico", "Histórico de atendimentos"],
  ])("abre %s por rota protegida", async (rota, titulo) => {
    abrir(`/barbeiro/${rota}`);
    expect(
      await screen.findByRole("heading", { name: titulo, level: 1 }),
    ).toBeInTheDocument();
    expect(await screen.findByRole("table")).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(`/dashboard/barbeiro/${rota}`),
      expect.objectContaining({
        credentials: "include",
        signal: expect.any(AbortSignal),
      }),
    );
  });
  it("diferencia preço atual e receita histórica", async () => {
    abrir("/barbeiro/servicos");
    expect(await screen.findByText("Preço-base atual")).toBeInTheDocument();
    expect(screen.getByText(/subtotais históricos/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Editar/ }),
    ).not.toBeInTheDocument();
  });
  it("usa carteira própria como filtro do histórico", async () => {
    abrir("/barbeiro/clientes");
    await userEvent.click(
      await screen.findByRole("link", { name: "Ver histórico" }),
    );
    expect(
      await screen.findByText(/Histórico filtrado pelo cliente #7/),
    ).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/historico\?.*idCliente=7/),
      expect.anything(),
    );
  });
  it("preserva filtros no retorno do detalhe e separa status da ação", async () => {
    abrir("/barbeiro/agenda?de=2026-10-31&ate=2026-10-31&status=CONFIRMADO");
    await userEvent.click(
      await screen.findByRole("link", { name: "Visualizar #1" }),
    );
    const voltar = await screen.findByRole("link", { name: "Voltar à lista" });
    expect(voltar).toHaveAttribute(
      "href",
      "/barbeiro/agenda?de=2026-10-31&ate=2026-10-31&status=CONFIRMADO",
    );
    expect(
      screen.queryByRole("button", { name: "Concluir atendimento" }),
    ).not.toBeInTheDocument();
  });
  it("exige motivo e confirmação antes do PATCH e invalida as consultas", async () => {
    const cache = abrir("/barbeiro/agenda/1");
    const invalidar = vi.spyOn(cache, "invalidateQueries");
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancelar atendimento" }),
    );
    expect(
      screen.getByRole("button", { name: "Confirmar alteração" }),
    ).toBeDisabled();
    expect(
      vi.mocked(fetch).mock.calls.some(([, opt]) => opt?.method === "PATCH"),
    ).toBe(false);
    await userEvent.type(
      screen.getByLabelText("Motivo do cancelamento"),
      "Compromisso",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar alteração" }),
    );
    await waitFor(() =>
      expect(invalidar).toHaveBeenCalledWith({ queryKey: ["barbeiro"] }),
    );
    expect(fetch).toHaveBeenCalledWith(
      expect.stringMatching(/agendamentos\/1$/),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          status: "CANCELADO",
          motivoCancelamento: "Compromisso",
        }),
      }),
    );
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([url]) => String(url).includes("historico-status")),
    ).toBe(false);
  });
  it("mostra o vazio contextual da agenda dentro do painel", async () => {
    vazio = true;
    abrir("/barbeiro/agenda");
    expect(
      await screen.findByText("Nenhum agendamento neste período."),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhuma opção disponível no momento."),
    ).not.toBeInTheDocument();
  });
  it.each([403, 503])("não transforma HTTP %s em vazio", async (status) => {
    statusHttp = status;
    abrir("/barbeiro/clientes");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum registro encontrado."),
    ).not.toBeInTheDocument();
  });
  it("não consulta sem permissão", async () => {
    permissao = false;
    abrir("/barbeiro/servicos");
    expect(await screen.findByRole("alert")).toHaveTextContent("permissão");
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([url]) => String(url).includes("/dashboard/")),
    ).toBe(false);
  });
  it("rejeita filtros manipulados sem consultar a agenda", async () => {
    abrir("/barbeiro/agenda?de=2026-02-30&pagina=1.2");
    expect(await screen.findByRole("alert")).toHaveTextContent("Confira");
    expect(
      vi
        .mocked(fetch)
        .mock.calls.some(([url]) => String(url).includes("/agendamentos")),
    ).toBe(false);
    expect(
      validarFiltros(new URLSearchParams("de=2026-12-01&ate=2026-11-01")).erro,
    ).toBeTruthy();
  });
  it("mostra carregamento sem antecipar vazio", async () => {
    const original = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation((entrada, opcoes) =>
      String(entrada).includes("/auth/me")
        ? original(entrada, opcoes)
        : new Promise(() => {}),
    );
    abrir("/barbeiro/servicos");
    expect(
      await screen.findByText("Carregando indicadores…"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Nenhum registro encontrado."),
    ).not.toBeInTheDocument();
  });
  it.each(["rede", "corpo inválido"])(
    "apresenta erro seguro para %s",
    async (falha) => {
      const original = vi.mocked(fetch).getMockImplementation()!;
      vi.mocked(fetch).mockImplementation((entrada, opcoes) =>
        String(entrada).includes("/auth/me")
          ? original(entrada, opcoes)
          : falha === "rede"
            ? Promise.reject(new Error("Falha simulada"))
            : Promise.resolve(json({ data: [{ id: 1 }], meta })),
      );
      abrir("/barbeiro/servicos");
      expect(await screen.findByRole("alert")).toBeInTheDocument();
      expect(screen.queryByRole("table")).not.toBeInTheDocument();
    },
  );
});
