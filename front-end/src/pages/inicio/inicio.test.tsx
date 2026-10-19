import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { Inicio } from ".";
import { ProvedorRascunhoAgendamento, useRascunhoAgendamento } from "../agendamento/rascunho-agendamento";
import { buscarBarbeirosInicio, buscarServicosInicio } from "./services/catalogo-inicio";

const servico = { id: 3, nome: "Corte", duracaoMinutos: 30, precoBase: "50.00" };
const barbeiro = { id: 2, nomeProfissional: "Ana", descricao: null, fotoUrl: "/foto.jpg" };
const resposta = (data: unknown, status = 200) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });
const pagina = (data: unknown[], atual = 1, total = 1) => ({ data, meta: { pagina: atual, totalPaginas: total } });
function Destino() {
  const { rascunho } = useRascunhoAgendamento();
  return <p>Serviços escolhidos: {rascunho.servicoIds.join(",")}</p>;
}
function PrepararRascunho() {
  const { alterar } = useRascunhoAgendamento();
  return <button onClick={() => alterar({ tipo: "servicos", ids: [3, 7] })}>Preparar escolhas</button>;
}
function montar(preparar = false) {
  return render(<QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
    <ProvedorRascunhoAgendamento><MemoryRouter>{preparar && <PrepararRascunho />}<Routes>
      <Route path="/" element={<Inicio />} />
      <Route path="/agendar" element={<Destino />} />
      <Route path="/login" element={<p>Tela de login</p>} />
    </Routes></MemoryRouter></ProvedorRascunhoAgendamento>
  </QueryClientProvider>);
}
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (input: string) => resposta(pagina(input.includes("servicos") ? [servico] : [barbeiro]))));
});
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

it("organiza a página, mantém os destinos e identifica os exemplos sem links", async () => {
  const { container } = montar();
  await screen.findByRole("heading", { name: "Corte" });
  expect([...container.querySelectorAll("section[id]")].map((s) => s.id)).toEqual(["inicio", "servicos", "barbeiros", "sobre", "contato"]);
  expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  expect(screen.queryByRole("navigation", { name: "Navegação principal" })).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Ver serviços" })).toHaveAttribute("href", "#servicos");
  expect(screen.getByRole("link", { name: /Agendar agora/ })).toHaveAttribute("href", "/agendar");
  expect(screen.getByRole("link", { name: "Ver disponibilidade" })).toHaveAttribute("href", "/agendar");
  const contato = container.querySelector("#contato")!;
  expect(within(contato as HTMLElement).getByText("Contatos demonstrativos")).toBeInTheDocument();
  expect(contato.querySelector("a")).toBeNull();
  expect(screen.queryByText("Apresentação demonstrativa")).not.toBeInTheDocument();
  const sobre = screen.getByRole("region", { name: "Sobre a Corte Certo" });
  expect(within(sobre).getByText("Cuidado em cada detalhe")).toBeInTheDocument();
  expect(within(sobre).getAllByRole("listitem")).toHaveLength(3);
  expect(within(sobre).getByRole("heading", { name: "Seu estilo em primeiro lugar" })).toBeInTheDocument();
  expect(within(sobre).getByRole("heading", { name: "Escolhas com clareza" })).toBeInTheDocument();
  expect(within(sobre).getByRole("heading", { name: "Praticidade na rotina" })).toBeInTheDocument();
  const imagens = within(sobre).getAllByRole("img");
  expect(imagens).toHaveLength(2);
  for (const imagem of imagens) {
    expect(imagem).toHaveAttribute("loading", "lazy");
    expect(imagem).toHaveAttribute("width", "1536");
    expect(imagem).toHaveAttribute("height", "1024");
    expect(imagem.getAttribute("alt")).toBeTruthy();
  }
  expect(within(sobre).getByRole("link", { name: "Agendar meu atendimento" })).toHaveAttribute("href", "/agendar");
  expect(screen.queryByText("Desde 2026")).not.toBeInTheDocument();
  await userEvent.click(screen.getByRole("link", { name: "Login" }));
  expect(screen.getByText("Tela de login")).toBeInTheDocument();
});
it("leva o serviço escolhido ao rascunho de agendamento", async () => {
  montar();
  await userEvent.click(await screen.findByRole("button", { name: "Agendar este serviço: Corte" }));
  expect(screen.getByText("Serviços escolhidos: 3")).toBeInTheDocument();
});
it("usa avatar se a foto falhar e omite descrição ausente", async () => {
  montar();
  fireEvent.error(await screen.findByRole("img", { name: "Foto de Ana" }));
  expect(screen.queryByRole("img", { name: "Foto de Ana" })).not.toBeInTheDocument();
  expect(screen.getByText("A", { selector: "span" })).toBeInTheDocument();
  expect(screen.queryByText("Profissional da nossa equipe.")).not.toBeInTheDocument();
});
it("mostra carregamento enquanto aguarda a API", () => {
  vi.mocked(fetch).mockImplementation(() => new Promise(() => {}));
  montar();
  expect(screen.getAllByRole("status")).toHaveLength(2);
  expect(screen.queryByText(/Nenhum serviço/)).not.toBeInTheDocument();
});
it("distingue catálogo vazio de falha", async () => {
  vi.mocked(fetch).mockImplementation(async () => resposta(pagina([], 1, 0)));
  montar();
  expect(await screen.findByText("Nenhum serviço disponível no momento.")).toBeInTheDocument();
  expect(await screen.findByText("Nenhum barbeiro disponível no momento.")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});
it("permite tentar novamente após falha HTTP sem mostrar catálogo fictício", async () => {
  vi.mocked(fetch).mockImplementation(async () => resposta({}, 503));
  montar();
  expect(await screen.findAllByRole("alert")).toHaveLength(2);
  expect(screen.queryByRole("heading", { name: "Corte" })).not.toBeInTheDocument();
  vi.mocked(fetch).mockImplementation(async () => resposta(pagina([servico])));
  await userEvent.click(screen.getAllByRole("button", { name: "Tentar novamente" })[0]);
  expect(await screen.findByRole("heading", { name: "Corte" })).toBeInTheDocument();
});
it.each([buscarServicosInicio, buscarBarbeirosInicio])("carrega todas as páginas do catálogo", async (buscar) => {
  vi.mocked(fetch).mockImplementation(async (input) => {
    const url = new URL(String(input));
    const atual = Number(url.searchParams.get("pagina"));
    return resposta(pagina([{ ...(url.pathname.includes("servicos") ? servico : barbeiro), id: atual }], atual, 2));
  });
  expect(await buscar()).toHaveLength(2);
  expect(fetch).toHaveBeenCalledTimes(2);
});
it("rejeita corpo inválido e falha de rede", async () => {
  vi.mocked(fetch).mockImplementation(async () => resposta(pagina([{ ...servico, precoBase: "inválido" }])));
  await expect(buscarServicosInicio()).rejects.toThrow();
  vi.mocked(fetch).mockRejectedValue(new TypeError("Falha de rede"));
  await expect(buscarBarbeirosInicio()).rejects.toThrow();
});

it("permite alcançar as ações principais pelo teclado", async () => {
  montar();
  await screen.findByRole("button", { name: "Agendar este serviço: Corte" });
  const usuario = userEvent.setup();
  await usuario.tab();
  expect(screen.getByRole("link", { name: "Login" })).toHaveFocus();
  await usuario.tab();
  expect(screen.getByRole("link", { name: /Agendar agora/ })).toHaveFocus();
  await usuario.tab();
  expect(screen.getByRole("link", { name: "Ver serviços" })).toHaveFocus();
  await usuario.tab();
  expect(screen.getByRole("button", { name: "Agendar este serviço: Corte" })).toHaveFocus();
  await usuario.keyboard("{Enter}");
  expect(screen.getByText("Serviços escolhidos: 3")).toBeInTheDocument();
});

it("abre o agendamento pelo Sobre sem limpar escolhas existentes", async () => {
  montar(true);
  await userEvent.click(screen.getByRole("button", { name: "Preparar escolhas" }));
  const link = screen.getByRole("link", { name: "Agendar meu atendimento" });
  link.focus();
  expect(link).toHaveFocus();
  await userEvent.keyboard("{Enter}");
  expect(screen.getByText("Serviços escolhidos: 3,7")).toBeInTheDocument();
});
