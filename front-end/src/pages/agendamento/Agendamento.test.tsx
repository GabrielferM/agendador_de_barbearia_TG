import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { ProvedorAutenticacao } from "../../auth/contexto-autenticacao";
import { Login } from "../login";
import { Inicio } from "../inicio";
import { AgendamentoCliente } from ".";
import {
  ProvedorRascunhoAgendamento,
  useRascunhoAgendamento,
} from "./rascunho-agendamento";
import { reduzirRascunho, rascunhoInicial } from "./estado-agendamento";
import { buscarFiliais } from "./services/agendamento-api";
import { MeusAgendamentos } from "../meus-agendamentos";

const filial = {
  id: 1,
  nome: "Centro",
  telefone: "1234",
  endereco: {
    logradouro: "Rua A",
    numero: "10",
    bairro: "Centro",
    cidade: "São Paulo",
    estado: "SP",
  },
};
const barbeiro = {
  id: 2,
  idFilial: 1,
  nomeProfissional: "João",
  descricao: "Cortes clássicos",
};
const servico = {
  id: 3,
  nome: "Corte",
  precoBase: "50.00",
  duracaoMinutos: 30,
};
const inicio = "2030-01-07T12:00:00.000Z";
const horarios = {
  fuso: "America/Sao_Paulo",
  valorTotal: "50.00",
  duracaoTotalMinutos: 30,
  horarios: [{ inicio, fim: "2030-01-07T12:30:00.000Z" }],
};
const agendamento = {
  id: 10,
  filial,
  barbeiro,
  inicioPrevisto: inicio,
  fimPrevisto: horarios.horarios[0].fim,
  status: "PENDENTE",
  servicos: [
    {
      idServico: 3,
      servico,
      subtotal: "50.00",
      precoAplicado: "50.00",
      quantidade: 1,
      duracaoAplicadaMinutos: 30,
    },
  ],
};
const usuario = {
  id: 1,
  nome: "Cliente",
  email: "cliente@teste.local",
  papel: "CLIENTE",
  permissoes: ["CRIAR_AGENDAMENTO"],
};
const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
const pagina = (data: unknown[]) => ({
  data,
  meta: {
    pagina: 1,
    total: data.length,
    totalPaginas: data.length ? 1 : 0,
    limite: 100,
  },
});
let filiais = [filial];
let autenticado = false;
let conflito = false;
function PrepararConfirmacao() {
  const { alterar } = useRascunhoAgendamento();
  return (
    <button
      onClick={() =>
        alterar({
          tipo: "atualizar",
          dados: {
            idFilial: 1,
            idBarbeiro: 2,
            servicoIds: [3],
            data: "2030-01-07",
            inicio,
            etapa: "Confirmar",
            observacao: "Corte curto",
          },
        })
      }
    >
      Preparar confirmação
    </button>
  );
}
function montar(rota = "/agendar") {
  const cliente = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={cliente}>
      <ProvedorAutenticacao>
        <ProvedorRascunhoAgendamento>
          <MemoryRouter initialEntries={[rota]}>
            <PrepararConfirmacao />
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/agendar" element={<AgendamentoCliente />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/cliente/agendamentos"
                element={<MeusAgendamentos />}
              />
            </Routes>
          </MemoryRouter>
        </ProvedorRascunhoAgendamento>
      </ProvedorAutenticacao>
    </QueryClientProvider>,
  );
}
beforeEach(() => {
  filiais = [filial];
  autenticado = false;
  conflito = false;
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string, init?: RequestInit) => {
      const url = new URL(input);
      if (url.pathname === "/auth/me")
        return json(autenticado ? { usuario } : {}, autenticado ? 200 : 401);
      if (url.pathname === "/auth/login") {
        autenticado = true;
        return json({ usuario });
      }
      if (url.pathname === "/publico/filiais") return json(pagina(filiais));
      if (url.pathname === "/publico/barbeiros")
        return json(pagina([barbeiro]));
      if (url.pathname === "/publico/servicos") return json(pagina([servico]));
      if (url.pathname === "/agendamentos/horarios-disponiveis")
        return json(horarios);
      if (url.pathname === "/agendamentos" && init?.method === "POST")
        return json(conflito ? {} : agendamento, conflito ? 409 : 201);
      if (url.pathname === "/agendamentos/10")
        return json({ ...agendamento, status: "CANCELADO" });
      if (url.pathname === "/agendamentos") return json(pagina([agendamento]));
      return json({}, 404);
    }),
  );
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
  };
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});
describe("Jornada de agendamento", () => {
  it("preserva o serviço escolhido no início ao selecionar uma filial", async () => {
    filiais = [filial, { ...filial, id: 4, nome: "Bairro" }];
    montar("/");
    await userEvent.click(
      await screen.findByRole("button", {
        name: "Agendar este serviço: Corte",
      }),
    );
    await userEvent.click(
      await screen.findByRole("radio", { name: /^Centro/ }),
    );
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    await userEvent.click(await screen.findByRole("radio", { name: /João/ }));
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(
      await screen.findByRole("checkbox", { name: /Corte/ }),
    ).toBeChecked();
    expect(screen.getByText("Serviços (1)")).toBeInTheDocument();
  });
  it("omite a filial única e exige serviço antes de continuar", async () => {
    montar();
    await screen.findByRole("heading", { name: "Barbeiro (1 de 4)" });
    await userEvent.click(await screen.findByRole("radio", { name: /João/ }));
    await userEvent.click(screen.getByRole("button", { name: "Continuar" }));
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
    await userEvent.click(
      await screen.findByRole("checkbox", { name: /Corte/ }),
    );
    expect(screen.getByRole("button", { name: "Continuar" })).toBeEnabled();
    expect(screen.getByText("Serviços (1)")).toBeInTheDocument();
  });
  it("mostra seleção com múltiplas filiais e vazio sem filiais", async () => {
    filiais = [filial, { ...filial, id: 4, nome: "Bairro" }];
    const tela = montar();
    await screen.findByRole("heading", { name: "Filial (1 de 5)" });
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    tela.unmount();
    filiais = [];
    montar();
    expect(
      await screen.findByText("Nenhuma opção disponível no momento."),
    ).toBeInTheDocument();
  });
  it("preserva escolhas no login e só cria após confirmação explícita", async () => {
    montar();
    await userEvent.click(screen.getByText("Preparar confirmação"));
    await userEvent.click(
      await screen.findByRole("button", { name: "Entrar para confirmar" }),
    );
    await userEvent.type(screen.getByLabelText("E-mail"), usuario.email);
    await userEvent.type(
      screen.getByLabelText("Senha"),
      "senha correta de teste",
    );
    await userEvent.click(screen.getByRole("button", { name: "Entrar" }));
    const confirmar = await screen.findByRole("button", {
      name: "Confirmar agendamento",
    });
    await waitFor(() => expect(confirmar).toBeEnabled());
    expect(screen.getByLabelText(/Observação para/)).toHaveValue("Corte curto");
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(
          ([url, init]) =>
            String(url).endsWith("/agendamentos") && init?.method === "POST",
        ),
    ).toHaveLength(0);
    await userEvent.click(confirmar);
    expect(
      await screen.findByText("Agendamento realizado!"),
    ).toBeInTheDocument();
    expect(screen.getByText("Pendente")).toBeInTheDocument();
    expect(
      screen.getByText(/Seu pedido está pendente de confirmação/),
    ).toBeInTheDocument();
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(
          ([url, init]) =>
            String(url).endsWith("/agendamentos") && init?.method === "POST",
        ),
    ).toHaveLength(1);
  });
  it("volta aos horários quando a criação encontra conflito", async () => {
    autenticado = true;
    conflito = true;
    montar();
    await userEvent.click(screen.getByText("Preparar confirmação"));
    const confirmar = await screen.findByRole("button", {
      name: "Confirmar agendamento",
    });
    await waitFor(() => expect(confirmar).toBeEnabled());
    await userEvent.click(confirmar);
    await screen.findByRole("heading", { name: "Data e horário (3 de 4)" });
    expect(screen.getByRole("button", { name: "Continuar" })).toBeDisabled();
  });
  it("solicita login novamente quando a sessão expira", async () => {
    autenticado = true;
    montar();
    await userEvent.click(screen.getByText("Preparar confirmação"));
    await screen.findByRole("button", { name: "Confirmar agendamento" });
    window.dispatchEvent(new Event("agendador:sessao-expirada"));
    expect(
      await screen.findByRole("button", { name: "Entrar para confirmar" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Observação para/)).toHaveValue("Corte curto");
  });
  it("exige motivo para cancelar e envia apenas a alteração permitida", async () => {
    autenticado = true;
    montar("/cliente/agendamentos");
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancelar agendamento #10" }),
    );
    expect(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    ).toBeDisabled();
    await userEvent.type(
      screen.getByLabelText("Motivo do cancelamento"),
      "Outro compromisso",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    );
    expect(
      await screen.findByText("Agendamento cancelado."),
    ).toBeInTheDocument();
    const chamada = vi
      .mocked(fetch)
      .mock.calls.find(([, init]) => init?.method === "PATCH");
    expect(JSON.parse(chamada?.[1]?.body as string)).toEqual({
      status: "CANCELADO",
      motivoCancelamento: "Outro compromisso",
    });
  });
});
it("carrega todas as páginas do catálogo", async () => {
  vi.mocked(fetch).mockImplementation(async (input) => {
    const paginaAtual = new URL(String(input)).searchParams.get("pagina");
    return json({
      data: [{ ...filial, id: Number(paginaAtual) }],
      meta: {
        pagina: Number(paginaAtual),
        total: 2,
        totalPaginas: 2,
        limite: 1,
      },
    });
  });
  expect(await buscarFiliais()).toHaveLength(2);
});
it("invalida somente escolhas dependentes", () => {
  const estado = {
    ...rascunhoInicial,
    idFilial: 1,
    idBarbeiro: 2,
    servicoIds: [3],
    data: "2030-01-07",
    inicio,
  };
  expect(reduzirRascunho(estado, { tipo: "barbeiro", id: 4 })).toMatchObject({
    servicoIds: [3],
    data: "",
    inicio: "",
  });
  expect(reduzirRascunho(estado, { tipo: "servicos", ids: [5] })).toMatchObject(
    { data: "2030-01-07", inicio: "" },
  );
  expect(reduzirRascunho(estado, { tipo: "filial", id: 4 })).toEqual({
    ...rascunhoInicial,
    idFilial: 4,
  });
});

describe("Área do cliente organizada", () => {
  function responderLista(itens: unknown[], falha?: () => boolean) {
    const anterior = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (
        url.pathname === "/agendamentos" &&
        (!init?.method || init.method === "GET")
      ) {
        if (falha?.()) return json({}, 503);
        return json(pagina(itens));
      }
      return anterior(input, init);
    });
  }
  it("mostra contagens completas, pagina a aba e permite alternar pelo teclado", async () => {
    autenticado = true;
    const anterior = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname !== "/agendamentos") return anterior(input, init);
      const atual = Number(url.searchParams.get("pagina"));
      return json({
        data:
          atual === 1
            ? Array.from({ length: 11 }, (_, i) => ({
                ...agendamento,
                id: i + 1,
              }))
            : [{ ...agendamento, id: 12, status: "CANCELADO" }],
        meta: { pagina: atual, totalPaginas: 2, total: 12, limite: 100 },
      });
    });
    montar("/cliente/agendamentos");
    const proximos = await screen.findByRole("tab", { name: "Próximos 11" });
    expect(screen.getAllByRole("article")).toHaveLength(10);
    await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(screen.getAllByRole("article")).toHaveLength(1);
    proximos.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Histórico 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Cancelar agendamento/ }),
    ).not.toBeInTheDocument();
    await userEvent.keyboard("{Home}");
    expect(screen.getAllByRole("article")).toHaveLength(10);
  });
  it("atualiza status e contagens após cancelar sem recarregar", async () => {
    autenticado = true;
    let cancelado = false;
    const anterior = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname === "/agendamentos/10") {
        cancelado = true;
        return json({ ...agendamento, status: "CANCELADO" });
      }
      if (url.pathname === "/agendamentos")
        return json(
          pagina([
            { ...agendamento, status: cancelado ? "CANCELADO" : "PENDENTE" },
          ]),
        );
      return anterior(input, init);
    });
    montar("/cliente/agendamentos");
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancelar agendamento #10" }),
    );
    await userEvent.type(
      screen.getByLabelText("Motivo do cancelamento"),
      "Outro compromisso",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    );
    expect(
      await screen.findByRole("tab", { name: "Próximos 0" }),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Histórico 1" }));
    expect(screen.getByText("Cancelado")).toBeInTheDocument();
  });
  it("preserva motivo após conflito e não envia duas vezes enquanto aguarda", async () => {
    autenticado = true;
    let concluir: ((resposta: Response) => void) | undefined;
    const anterior = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation(async (input, init) => {
      if (new URL(String(input)).pathname === "/agendamentos/10")
        return new Promise<Response>((resolve) => {
          concluir = resolve;
        });
      return anterior(input, init);
    });
    montar("/cliente/agendamentos");
    await userEvent.click(
      await screen.findByRole("button", { name: "Cancelar agendamento #10" }),
    );
    await userEvent.type(
      screen.getByLabelText("Motivo do cancelamento"),
      "Outro compromisso",
    );
    await userEvent.dblClick(
      screen.getByRole("button", { name: "Confirmar cancelamento" }),
    );
    expect(
      vi
        .mocked(fetch)
        .mock.calls.filter(([, init]) => init?.method === "PATCH"),
    ).toHaveLength(1);
    expect(screen.getByRole("button", { name: "Cancelando…" })).toBeDisabled();
    concluir!(json({}, 409));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A agenda foi atualizada",
    );
    expect(screen.getByLabelText("Motivo do cancelamento")).toHaveValue(
      "Outro compromisso",
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("distingue erro recuperável e vazio em cada aba", async () => {
    autenticado = true;
    let falha = true;
    responderLista([], () => falha);
    montar("/cliente/agendamentos");
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível acessar",
    );
    falha = false;
    await userEvent.click(
      screen.getByRole("button", { name: "Tentar novamente" }),
    );
    expect(
      await screen.findByText("Nenhum atendimento próximo"),
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("tab", { name: "Histórico 0" }));
    expect(
      screen.getByText("Seu histórico ainda está vazio"),
    ).toBeInTheDocument();
  });
  it("não apresenta resultados parciais se a segunda página falhar", async () => {
    autenticado = true;
    const anterior = vi.mocked(fetch).getMockImplementation()!;
    vi.mocked(fetch).mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname !== "/agendamentos") return anterior(input, init);
      return url.searchParams.get("pagina") === "1"
        ? json({
            data: [agendamento],
            meta: { pagina: 1, total: 2, totalPaginas: 2 },
          })
        : json({}, 503);
    });
    montar("/cliente/agendamentos");
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
