import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import type { DiaAgenda } from "./types";
import App from "../../../../App";
import { consultarAgenda } from "./services/agendamentos-api";

let todosStatus = false, duplicado = false, diaErrado = false, negado = false;
let permitido = true, falha = false, invalida = false, vazio = false, falhaRede = false;
const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
beforeEach(() => {
  todosStatus = false; duplicado = false; diaErrado = false; negado = false;
  permitido = true; falha = false; invalida = false; vazio = false; falhaRede = false;
  vi.setSystemTime(new Date("2026-10-26T15:00:00Z"));
  vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
  vi.stubGlobal("fetch", vi.fn(async (entrada: RequestInfo | URL) => {
    const url = new URL(String(entrada));
    if (url.pathname === "/auth/me") return json({ usuario: {
      id: 1, nome: "Administrador", email: "admin@exemplo.com", papel: "ADMINISTRADOR",
      permissoes: permitido ? ["GERENCIAR_AGENDAMENTOS"] : [],
    } });
    if (negado) return json({}, 403);
    if (falhaRede) throw new TypeError("Failed to fetch");
    if (falha) return json({}, 503);
    if (invalida) return json({ dias: [] });
    const inicio = url.searchParams.get("inicioDe")!, fim = url.searchParams.get("inicioAte")!;
    const dias: DiaAgenda[] = [];
    for (let data = inicio; data <= fim;) {
      dias.push({ data, rotulo: "Dia", agendamentos: vazio || data !== inicio ? [] : [{
        id: 25, inicio: `${data}T09:00:00-03:00`, fim: `${data}T10:00:00-03:00`,
        cliente: "Cliente da API", barbeiro: "Barbeiro da API", servicos: ["Corte", "Barba"], status: "CONCLUIDO", total: 60,
      }] });
      data = new Date(Date.parse(data) + 86_400_000).toISOString().slice(0, 10);
    }
    if (todosStatus && dias[0].agendamentos.length) {
      dias[0].agendamentos = (["CONFIRMADO", "PENDENTE", "EM_ATENDIMENTO", "CONCLUIDO", "CANCELADO", "NAO_COMPARECEU"] as const).map((status, i) => ({
        ...dias[0].agendamentos[0], id: 30 + i, status, inicio: `${inicio}T${String(15 - i).padStart(2, "0")}:00:00-03:00`,
      }));
    }
    if (duplicado) dias[0].agendamentos.push(dias[0].agendamentos[0]);
    if (diaErrado) dias[0].agendamentos[0].inicio = `${inicio}T02:59:00Z`;
    return json({ dias, totaisPorStatus: { CONCLUIDO: 999 } });
  }));
});
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs(); vi.useRealTimers(); });
function abrir() {
  window.history.pushState({}, "", "/admin/agendamentos");
  render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false, retryDelay: 0 } } })}><App /></QueryClientProvider>);
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

it("conta cada atendimento uma vez nos seis status e sincroniza lista, seleção e total", async () => {
  todosStatus = true; abrir(); await screen.findAllByText("Cliente da API");
  const resumo = within(screen.getByRole("complementary", { name: "Resumo do dia selecionado" }));
  for (const rotulo of ["Confirmados", "Pendentes", "Em atendimento", "Concluídos", "Cancelados", "Não compareceram"])
    expect(resumo.getByText(rotulo, { selector: "dt" }).nextElementSibling).toHaveTextContent("1");
  expect(resumo.getAllByRole("listitem")).toHaveLength(6);
  expect(resumo.getAllByRole("listitem")[0]).toHaveTextContent("10:00");
  expect(screen.getByText("6 agendamentos na semana")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: /27 de outubro/ }));
  expect(resumo.getAllByRole("definition").every(item => item.textContent === "0")).toBe(true);
  expect(resumo.queryAllByRole("listitem")).toHaveLength(0);
  expect(resumo.getByText(/27 de outubro/)).toBeInTheDocument();
  expect(screen.getByText("6 agendamentos na semana")).toBeInTheDocument();
  await userEvent.click(screen.getByRole("button", { name: "Hoje" }));
  expect(resumo.getAllByRole("listitem")).toHaveLength(6);
});
it.each(["duplicado", "diaErrado"])("rejeita %s em vez de apresentar contagens incorretas", async caso => {
  duplicado = caso === "duplicado"; diaErrado = caso === "diaErrado"; abrir();
  expect(await screen.findByText("A API retornou uma agenda inválida. Tente novamente.")).toBeInTheDocument();
  expect(screen.queryByText("Resumo do dia")).not.toBeInTheDocument();
});
it("mostra 403 do servidor sem resumo zerado nem estado vazio", async () => {
  negado = true; abrir();
  expect(await screen.findByRole("alert")).toHaveTextContent("Você não possui permissão");
  expect(screen.queryByText("Resumo do dia")).not.toBeInTheDocument();
  expect(screen.queryByText("Nenhum agendamento neste período.")).not.toBeInTheDocument();
});
it("mantém seleção acessível no período totalmente vazio", async () => {
  vazio = true; abrir(); await screen.findByText("Nenhum agendamento neste período.");
  expect(screen.queryByText("Sem agendamentos")).not.toBeInTheDocument();
  const dia = screen.getByRole("button", { name: /28 de outubro/ });
  await userEvent.click(dia);
  expect(dia).toHaveAttribute("aria-pressed", "true");
  expect(within(screen.getByRole("complementary", { name: "Resumo do dia selecionado" })).getByText(/28 de outubro/)).toBeInTheDocument();
});

it("reutiliza o período em cache ao navegar de volta", async () => {
  abrir(); await screen.findAllByText("Cliente da API");
  const usuario = userEvent.setup();
  const consultas = () => vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes("/dashboard/administrador/agendamentos"));
  expect(consultas()).toHaveLength(1);
  await usuario.click(screen.getByRole("button", { name: "Próximo período" }));
  await screen.findByText("08/11");
  expect(consultas()).toHaveLength(2);
  await usuario.click(screen.getByRole("button", { name: "Período anterior" }));
  await screen.findByText("01/11");
  expect(consultas()).toHaveLength(2);
});

it("não repete 429 e bloqueia nova tentativa até o Retry-After", async () => {
  const original = vi.mocked(fetch).getMockImplementation()!;
  vi.mocked(fetch).mockImplementation(async (entrada, opcoes) => {
    if (String(entrada).includes("/dashboard/")) return new Response("{}", { status: 429, headers: { "Retry-After": "1" } });
    return original(entrada, opcoes);
  });
  abrir();
  expect(await screen.findByRole("alert")).toHaveTextContent("Limite de requisições atingido");
  expect(screen.getByRole("button", { name: "Aguarde 1 segundo" })).toBeDisabled();
  vi.setSystemTime(new Date("2026-10-26T15:00:02Z"));
  expect(await screen.findByRole("button", { name: "Tentar novamente" }, { timeout: 2500 })).toBeEnabled();
  expect(vi.mocked(fetch).mock.calls.filter(([url]) => String(url).includes("/dashboard/"))).toHaveLength(1);
  vi.mocked(fetch).mockImplementation(original);
  await userEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
  await screen.findAllByText("Cliente da API");
});

it.each([
  ["2", 2],
  ["Mon, 26 Oct 2026 15:00:02 GMT", 2],
  [undefined, 60],
  ["inválido", 60],
  ["-1", 60],
  ["0", 0],
] as const)("interpreta Retry-After %s na resposta 429", async (valor, espera) => {
  vi.mocked(fetch).mockResolvedValue(new Response("{}", {
    status: 429,
    headers: valor === undefined ? {} : { "Retry-After": valor },
  }));
  await expect(consultarAgenda("2026-10-26", "2026-11-01")).rejects.toMatchObject({
    status: 429,
    esperarAte: Date.now() + espera * 1000,
  });
});
