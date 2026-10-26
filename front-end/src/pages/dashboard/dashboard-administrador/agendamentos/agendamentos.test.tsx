import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";

let permitido = true, falha = false, invalida = false, vazio = false, falhaRede = false;
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
beforeEach(() => {
  permitido = true; falha = false; invalida = false; vazio = false; falhaRede = false;
  vi.setSystemTime(new Date("2026-10-26T15:00:00Z"));
  vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
  vi.stubGlobal("fetch", vi.fn(async (entrada: RequestInfo | URL) => {
    const url = new URL(String(entrada));
    if (url.pathname === "/auth/me") return json({ usuario: {
      id: 1, nome: "Administrador", email: "admin@exemplo.com", papel: "ADMINISTRADOR",
      permissoes: permitido ? ["GERENCIAR_AGENDAMENTOS"] : [],
    } });
    if (falhaRede) throw new TypeError("Failed to fetch");
    if (falha) return json({}, 503);
    if (invalida) return json({ dias: [] });
    const inicio = url.searchParams.get("inicioDe")!, fim = url.searchParams.get("inicioAte")!;
    const dias = [];
    for (let data = inicio; data <= fim;) {
      dias.push({ data, rotulo: "Dia", agendamentos: vazio || data !== inicio ? [] : [{
        id: 25, inicio: `${data}T09:00:00-03:00`, fim: `${data}T10:00:00-03:00`,
        cliente: "Cliente da API", barbeiro: "Barbeiro da API", servicos: ["Corte", "Barba"], status: "CONCLUIDO", total: 60,
      }] });
      data = new Date(Date.parse(data) + 86_400_000).toISOString().slice(0, 10);
    }
    return json({ dias });
  }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
function abrir() {
  window.history.pushState({}, "", "/admin/agendamentos");
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}><App /></QueryClientProvider>);
}
it("consulta a API mesmo com demonstração habilitada e mostra datas e contagens reais", async () => {
  abrir();
  expect((await screen.findAllByText("Cliente da API")).length).toBeGreaterThan(0);
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
  expect(screen.queryByText("Matheus Lima")).not.toBeInTheDocument();
  expect(screen.getByText("01/11")).toBeInTheDocument();
  expect(screen.getByText("Concluídos").nextElementSibling).toHaveTextContent("1");
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inicioDe=2026-10-26&inicioAte=2026-11-01"), expect.objectContaining({ credentials: "include" }));
});
it("navega entre períodos e seleciona o resumo", async () => {
  abrir(); await screen.findAllByText("Cliente da API");
  const usuario = userEvent.setup();
  await usuario.click(screen.getByRole("button", { name: /27 de outubro/ }));
  expect(screen.getByText("Nenhum agendamento neste dia.")).toBeInTheDocument();
  await usuario.click(screen.getByRole("button", { name: "Mês" }));
  await screen.findByText("31/10");
  await usuario.click(screen.getByRole("button", { name: "Próximo período" }));
  await screen.findByText("30/11");
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inicioDe=2026-11-01&inicioAte=2026-11-30"), expect.anything());
  await usuario.click(screen.getByRole("button", { name: "Dia" }));
  await screen.findByRole("heading", { name: "Resumo do dia" });
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inicioDe=2026-11-01&inicioAte=2026-11-01"), expect.anything());
  await usuario.click(screen.getByRole("button", { name: "Hoje" }));
  await screen.findByText("26/10");
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("inicioDe=2026-10-26&inicioAte=2026-10-26"), expect.anything());
});
it("mostra vazio sem criar exemplos", async () => {
  vazio = true; abrir();
  expect(await screen.findByText("Nenhum agendamento neste período.")).toBeInTheDocument();
});
it("trata erro HTTP e oferece nova tentativa sem fallback", async () => {
  falha = true; abrir();
  expect(await screen.findByText("Não foi possível carregar os agendamentos. Tente novamente.")).toBeInTheDocument();
  falha = false;
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  expect((await screen.findAllByText("Cliente da API")).length).toBeGreaterThan(0);
});
it("rejeita resposta inválida", async () => {
  invalida = true; abrir();
  expect(await screen.findByText("A API retornou uma agenda inválida. Tente novamente.")).toBeInTheDocument();
});
it("oferece nova tentativa após falha de rede sem demonstrar dados", async () => {
  falhaRede = true; abrir();
  expect(await screen.findByRole("button", { name: "Tentar novamente" })).toBeInTheDocument();
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
});
it("não consulta a agenda sem permissão", async () => {
  permitido = false; abrir();
  expect(await screen.findByText("Você não possui permissão para consultar agendamentos.")).toBeInTheDocument();
  expect(vi.mocked(fetch).mock.calls.some(([entrada]) => String(entrada).includes("/dashboard/"))).toBe(false);
});
