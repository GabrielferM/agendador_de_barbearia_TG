import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";
const dados = {
  geradoEm: "2026-10-26T15:00:00Z",
  periodo: { inicioDe: "2026-10-01", inicioAte: "2026-10-26" },
  indicadores: { receita: 100, variacaoReceitaPercentual: -10, comissoes: 30 },
  fluxoSemanal: [{ inicio: "2026-10-01", receita: 0 }],
  movimentacoesRecentes: [
    {
      id: 9,
      data: "2026-10-26T12:00:00Z",
      descricao: "Corte real",
      categoria: "Receita",
      valor: 100,
      status: "CONCLUIDO",
    },
  ],
  comissoesPorBarbeiro: [
    {
      id: 9,
      barbeiro: "Profissional real",
      total: 30,
      porStatus: {
        PREVISTA: 10,
        LIBERADA: 5,
        PAGA: 10,
        CANCELADA: 3,
        ESTORNADA: 2,
      },
    },
  ],
};
let repassado = false;
let taxaSalva: string | null = null;
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
  repassado = false;
  taxaSalva = null;
  falha = false;
  invalida = false;
  vazio = false;
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
            permissoes: permitido ? ["GERENCIAR_COMISSOES"] : [],
          },
        });
      if (url.pathname === "/financeiro/comissoes/50/repasse") {
        repassado = true;
        return json({
          idComissao: 50,
          valor: "12.50",
          dataRegistro: "2026-10-26T15:00:00Z",
        });
      }
      if (url.pathname === "/financeiro/barbeiros/9/percentual") {
        const corpo = JSON.parse(String(opcoes?.body)) as {
          percentual: number;
        };
        taxaSalva = corpo.percentual.toFixed(2);
        return new Response(null, { status: 204 });
      }
      if (url.pathname === "/financeiro/barbeiros")
        return json({
          itens: [{ id: 9, nome: "Profissional real", percentual: taxaSalva }],
          pagina: 1,
          totalPaginas: 1,
        });
      if (url.pathname === "/financeiro/comissoes")
        return json({
          previstas: "10.00",
          aReceber: repassado ? "0.00" : "12.50",
          pagasNoPeriodo: repassado ? "12.50" : "0.00",
          geradasNoPeriodo: "12.50",
          totalPaginas: 1,
          itens: [
            {
              id: 50,
              barbeiro: "Profissional real",
              servico: "Barba",
              baseCalculo: "50.00",
              percentualAplicado: "25.00",
              valorComissao: "12.50",
              status: repassado ? "PAGA" : "LIBERADA",
              dataGeracao: "2026-10-26T15:00:00Z",
              dataPagamento: repassado ? "2026-10-26T15:00:00Z" : null,
            },
          ],
        });
      if (falha) return json({}, 503);
      if (invalida) return json({ indicadores: {} });
      return json(
        vazio
          ? { ...dados, movimentacoesRecentes: [], comissoesPorBarbeiro: [] }
          : dados,
      );
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});
function abrir() {
  window.history.pushState({}, "", "/admin/financeiro");
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
    expect.stringContaining("/dashboard/administrador/financeiro"),
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
    await screen.findByText("Nenhum atendimento concluído no período."),
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
it("aplica um intervalo explícito e preserva as cinco situações de comissão", async () => {
  abrir();
  await screen.findByText("Corte real");
  for (const nome of ["Prevista", "Liberada", "Paga", "Cancelada", "Estornada"])
    expect(
      screen.getByRole("columnheader", { name: nome }),
    ).toBeInTheDocument();
  await userEvent.clear(screen.getByLabelText("De"));
  await userEvent.type(screen.getByLabelText("De"), "2026-09-01");
  await userEvent.clear(screen.getByLabelText("Até"));
  await userEvent.type(screen.getByLabelText("Até"), "2026-09-30");
  await userEvent.click(
    screen.getByRole("button", { name: "Aplicar período" }),
  );
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        "/dashboard/administrador/financeiro?inicioDe=2026-09-01&inicioAte=2026-09-30",
      ),
      expect.anything(),
    ),
  );
});
it("exige confirmação para registrar o repasse e atualiza o extrato", async () => {
  abrir();
  await userEvent.click(
    await screen.findByRole("button", { name: "Registrar repasse" }),
  );
  expect(repassado).toBe(false);
  await userEvent.click(
    screen.getByRole("button", { name: "Confirmar registro" }),
  );
  expect(await screen.findByText("Repasse registrado.")).toBeInTheDocument();
  await waitFor(() =>
    expect(
      screen.queryByRole("button", { name: "Registrar repasse" }),
    ).not.toBeInTheDocument(),
  );
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/financeiro/comissoes/50/repasse"),
    expect.objectContaining({ method: "POST" }),
  );
});
it("permite configurar zero sem confundir com taxa ausente", async () => {
  abrir();
  const campo = await screen.findByRole("spinbutton", {
    name: /Sem taxa definida/,
  });
  await userEvent.type(campo, "0");
  await userEvent.click(
    screen.getByRole("button", { name: "Salvar percentual" }),
  );
  expect(await screen.findByText("Percentual salvo.")).toBeInTheDocument();
  expect(
    screen.getByRole("spinbutton", { name: /0% configurado/ }),
  ).toHaveValue(0);
});
