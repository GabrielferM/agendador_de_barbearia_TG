import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";
const dados = {
  geradoEm: "2026-10-26T15:00:00Z",
  periodo: { inicioDe: "2026-10-01", inicioAte: "2026-10-26" },
  indicadores: { receita: 100, variacaoReceitaPercentual: -10, comissoes: 30, comissoesAPagar: 15 },
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
            permissoes: permitido ? ["GERENCIAR_COMISSOES"] : [],
          },
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
  expect(fetch).toHaveBeenLastCalledWith(
    expect.stringContaining("inicioDe=2026-09-01&inicioAte=2026-09-30"),
    expect.anything(),
  );
});
it('cadastra comissão de item real sem pedir IDs ao administrador', async () => {
 const original = vi.mocked(fetch).getMockImplementation()!;
 const paginada = (data: unknown[]) => json({ data, meta: { pagina: 1, limite: 10, total: data.length, totalPaginas: 1 } });
 vi.mocked(fetch).mockImplementation(async (entrada, options) => {
  const url = new URL(String(entrada));
  if (url.pathname === '/barbeiros') return paginada([{ id: 55, nomeProfissional: 'Profissional teste' }]);
  if (url.pathname === '/comissoes') return options?.method === 'POST' ? json({}, 201) : paginada([]);
  if (url.pathname === '/agendamentos') return paginada([{ id: 77, idBarbeiro: 55, inicioPrevisto: '2026-01-07T12:00:00Z', cliente: { usuario: { nome: 'Cliente teste' } }, barbeiro: { nomeProfissional: 'Profissional teste' }, servicos: [{ id: 88, subtotal: '50.00', comissao: null, servico: { nome: 'Corte' } }] }]);
  return original(entrada, options);
 });
 abrir(); await userEvent.click(await screen.findByRole('button', { name: 'Nova comissão' }));
 await userEvent.selectOptions(await screen.findByLabelText('Item de atendimento concluído'), '88');
 await userEvent.type(screen.getByLabelText('Percentual (%)'), '30');
 await userEvent.click(screen.getByRole('button', { name: 'Salvar' }));
 await screen.findByText('Comissão salva.');
 const chamada = vi.mocked(fetch).mock.calls.find(([, o]) => o?.method === 'POST')!;
 expect(JSON.parse(String(chamada[1]?.body))).toMatchObject({ idAgendamentoServico: 88, idBarbeiro: 55, percentualAplicado: 30 });
 expect(screen.queryByRole('button', { name: /Excluir comissão/ })).not.toBeInTheDocument();
});
