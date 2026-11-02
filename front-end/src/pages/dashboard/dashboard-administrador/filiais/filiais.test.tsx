import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import App from "../../../../App";

const filialBase = {
  id: 1,
  nome: "Centro",
  cnpj: "11222333000181",
  telefone: "11999999999",
  email: "centro@exemplo.com",
  status: "ATIVA",
  endereco: {
    cep: "01001000",
    logradouro: "Praça da Sé",
    numero: "1",
    complemento: "Sala 2",
    bairro: "Sé",
    cidade: "São Paulo",
    estado: "SP",
  },
};
let filiais: (typeof filialBase)[];
let permitido: boolean,
  falhaLista: boolean,
  invalida: boolean,
  falhaDetalhe: boolean,
  vazio: boolean;
let falhaGravacao: number, respostaGravacaoInvalida: boolean;
let aguardarGravacao: Promise<void> | undefined;
const json = (dados: unknown, status = 200) =>
  new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json" },
  });

beforeEach(() => {
  filiais = [structuredClone(filialBase)];
  permitido = true;
  falhaLista = false;
  invalida = false;
  falhaDetalhe = false;
  vazio = false;
  falhaGravacao = 0;
  respostaGravacaoInvalida = false;
  aguardarGravacao = undefined;
  vi.stubEnv("VITE_USAR_DADOS_MOCKADOS", "true");
  document.cookie = "csrf=teste-csrf";
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
            permissoes: permitido ? ["GERENCIAR_FILIAIS"] : [],
          },
        });
      if (opcoes?.method === "POST" || opcoes?.method === "PATCH") {
        await aguardarGravacao;
        if (falhaGravacao) return json({}, falhaGravacao);
        if (respostaGravacaoInvalida)
          return json({}, opcoes.method === "POST" ? 201 : 200);
        const dados = JSON.parse(String(opcoes.body)) as typeof filialBase;
        const id =
          opcoes.method === "POST" ? 2 : Number(url.pathname.split("/").pop());
        const anterior = filiais.find((f) => f.id === id) ?? filialBase;
        const salva = {
          ...anterior,
          ...dados,
          id,
          status: dados.status ?? "ATIVA",
          endereco: { ...anterior.endereco, ...dados.endereco },
        };
        filiais = [...filiais.filter((f) => f.id !== id), salva];
        return json(salva, opcoes.method === "POST" ? 201 : 200);
      }
      if (url.pathname === "/filiais") {
        if (falhaLista) return json({}, 503);
        if (invalida) return json({ data: [{ id: 1 }] });
        const status = url.searchParams.get("status");
        return json({
          data: vazio
            ? []
            : filiais.filter((f) => !status || f.status === status),
          meta: {
            pagina: Number(url.searchParams.get("pagina")),
            limite: 12,
            total: vazio ? 0 : 25,
            totalPaginas: vazio ? 0 : 3,
          },
        });
      }
      if (url.pathname.startsWith("/filiais/"))
        return falhaDetalhe
          ? json({}, 404)
          : json(
              filiais.find(
                (f) => f.id === Number(url.pathname.split("/").pop()),
              ),
            );
      throw new Error("Requisição inesperada no teste.");
    }),
  );
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  document.cookie = "csrf=; max-age=0";
});

function abrir(caminho = "/admin/filiais") {
  const cache = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  window.history.pushState({}, "", caminho);
  render(
    <QueryClientProvider client={cache}>
      <App />
    </QueryClientProvider>,
  );
  return cache;
}
const gravacoes = () =>
  vi
    .mocked(fetch)
    .mock.calls.filter(([, opcoes]) =>
      ["POST", "PATCH"].includes(opcoes?.method ?? ""),
    );
const formulario = () =>
  screen.getByRole("form", { name: "Formulário de cadastro" });
async function preencherNovo() {
  await userEvent.click(
    await screen.findByRole("button", { name: "Nova filial" }),
  );
  for (const [nome, valor] of Object.entries({
    Nome: "Norte",
    CNPJ: "11222333000181",
    CEP: "01001-000",
    Logradouro: "Rua Norte",
    Número: "10",
    Bairro: "Centro",
    Cidade: "São Paulo",
    UF: "sp",
  })) {
    await userEvent.type(
      within(formulario()).getByRole("textbox", { name: nome }),
      valor,
    );
  }
}

it("acessa pelo menu, consulta dados reais e envia paginação/filtro ao servidor", async () => {
  abrir("/admin/servicos");
  const link = await screen.findByRole("link", { name: "Filiais" });
  await userEvent.click(link);
  await screen.findByRole("button", { name: "Editar Centro" });
  expect(screen.queryByText("Dados demonstrativos")).not.toBeInTheDocument();
  expect(fetch).toHaveBeenCalledWith(
    expect.stringContaining("/filiais?pagina=1&limite=12"),
    expect.objectContaining({
      credentials: "include",
      signal: expect.any(AbortSignal),
    }),
  );
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  await waitFor(() =>
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("pagina=2"),
      expect.anything(),
    ),
  );
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Status" }),
    "INATIVA",
  );
  await screen.findByText("Nenhuma filial encontrada.");
  expect(fetch).toHaveBeenCalledWith(
    expect.stringMatching(/status=INATIVA.*pagina=1/),
    expect.anything(),
  );
  expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
});

it("não consulta nem oferece ações sem permissão", async () => {
  permitido = false;
  abrir();
  await screen.findByRole("alert");
  expect(
    screen.queryByRole("link", { name: "Filiais" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Nova filial" }),
  ).not.toBeInTheDocument();
  expect(
    vi
      .mocked(fetch)
      .mock.calls.some(([url]) => String(url).includes("/filiais")),
  ).toBe(false);
});

it("distingue carregamento, erro, nova tentativa e vazio", async () => {
  falhaLista = true;
  abrir();
  expect(screen.getByText("Carregando sessão…")).toBeInTheDocument();
  const tentar = await screen.findByRole("button", {
    name: "Tentar novamente",
  });
  falhaLista = false;
  vazio = true;
  await userEvent.click(tentar);
  await screen.findByText("Nenhuma filial encontrada.");
});

it("rejeita lista malformada", async () => {
  invalida = true;
  abrir();
  await screen.findByRole("button", { name: "Tentar novamente" });
  expect(
    screen.queryByRole("button", { name: "Editar Centro" }),
  ).not.toBeInTheDocument();
});

it("cadastra filial ativa com endereço e invalida consultas dependentes", async () => {
  const cache = abrir(),
    invalidar = vi.spyOn(cache, "invalidateQueries");
  await preencherNovo();
  expect(within(formulario()).queryByRole("combobox")).not.toBeInTheDocument();
  await userEvent.click(
    within(formulario()).getByRole("button", { name: "Salvar" }),
  );
  await screen.findByText("Filial cadastrada.");
  const [, opcoes] = gravacoes()[0];
  expect(JSON.parse(String(opcoes?.body))).toEqual({
    nome: "Norte",
    cnpj: "11222333000181",
    endereco: {
      cep: "01001-000",
      logradouro: "Rua Norte",
      numero: "10",
      bairro: "Centro",
      cidade: "São Paulo",
      estado: "SP",
    },
  });
  expect(opcoes?.credentials).toBe("include");
  expect(new Headers(opcoes?.headers).get("X-CSRF-Token")).toBe("teste-csrf");
  for (const queryKey of [
    ["admin", 1, "filiais"],
    ["admin", 1, "filial"],
    ["admin", 1, "barbeiros"],
    ["admin", 1, "filiais-cadastro-barbeiro"],
    ["inicio", "barbeiros"],
    ["agendar"],
  ])
    expect(invalidar).toHaveBeenCalledWith({ queryKey });
  expect(screen.queryByRole("form")).not.toBeInTheDocument();
  await screen.findByRole("button", { name: "Editar Norte" });
});

it.each(["INATIVA", "EM_MANUTENCAO", "ATIVA"])(
  "edita cadastro atualizado, limpa opcionais e grava status %s",
  async (status) => {
    abrir();
    await userEvent.click(
      await screen.findByRole("button", { name: "Editar Centro" }),
    );
    const nome = await screen.findByRole("textbox", {
      name: "Nome",
    });
    expect(nome).toHaveValue("Centro");
    expect(nome).toHaveFocus();
    for (const campo of ["Telefone", "E-mail", "Complemento"])
      await userEvent.clear(
        within(formulario()).getByRole("textbox", { name: campo }),
      );
    await userEvent.selectOptions(
      within(formulario()).getByRole("combobox", { name: /^Status da filial/ }),
      status,
    );
    expect(
      screen.getByText(/suspendem novas reservas sem cancelar/),
    ).toBeInTheDocument();
    await userEvent.click(
      within(formulario()).getByRole("button", { name: "Salvar" }),
    );
    await screen.findByText("Filial atualizada.");
    expect(gravacoes()[0][0]).toContain("/filiais/1");
    expect(JSON.parse(String(gravacoes()[0][1]?.body))).toMatchObject({
      telefone: null,
      email: null,
      status,
      endereco: { complemento: null },
    });
    expect(gravacoes()[0][1]?.method).toBe("PATCH");
  },
);

it("preserva filtro e retorna à primeira página após gravação", async () => {
  abrir();
  await screen.findByRole("button", { name: "Editar Centro" });
  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Status" }),
    "ATIVA",
  );
  await userEvent.click(screen.getByRole("button", { name: "Próxima" }));
  await userEvent.click(
    await screen.findByRole("button", { name: "Editar Centro" }),
  );
  await screen.findByRole("textbox", { name: "Nome" });
  await userEvent.click(
    within(formulario()).getByRole("button", { name: "Salvar" }),
  );
  await screen.findByText("Filial atualizada.");
  expect(
    screen.getByRole("combobox", { name: "Status" }),
  ).toHaveValue("ATIVA");
  expect(screen.getByRole("button", { name: "Anterior" })).toBeDisabled();
});

it("preserva campos em conflito e impede duplicação durante nova tentativa", async () => {
  falhaGravacao = 409;
  abrir();
  await preencherNovo();
  await userEvent.click(
    within(formulario()).getByRole("button", { name: "Salvar" }),
  );
  await screen.findByText("Já existe uma filial com esse CNPJ.");
  expect(
    within(formulario()).getByRole("textbox", { name: "Nome" }),
  ).toHaveValue("Norte");
  falhaGravacao = 0;
  let liberar!: () => void;
  aguardarGravacao = new Promise<void>((resolve) => {
    liberar = resolve;
  });
  await userEvent.dblClick(
    within(formulario()).getByRole("button", { name: "Salvar" }),
  );
  expect(screen.getByRole("button", { name: "Salvando…" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Fechar" })).toBeDisabled();
  expect(gravacoes()).toHaveLength(2);
  liberar();
  await screen.findByText("Filial cadastrada.");
});

it.each(["http", "rede", "resposta"])(
  "não confirma gravação após falha %s",
  async (tipo) => {
    abrir();
    await preencherNovo();
    if (tipo === "http") falhaGravacao = 503;
    if (tipo === "resposta") respostaGravacaoInvalida = true;
    if (tipo === "rede")
      vi.mocked(fetch).mockRejectedValueOnce(new TypeError("Erro de rede"));
    await userEvent.click(
      within(formulario()).getByRole("button", { name: "Salvar" }),
    );
    await screen.findByRole("alert");
    expect(screen.queryByText("Filial cadastrada.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Salvar" })).toBeEnabled();
    expect(gravacoes()).toHaveLength(1);
  },
);

it("exibe erro no detalhe e permite fechar sem gravar", async () => {
  falhaDetalhe = true;
  abrir();
  await userEvent.click(
    await screen.findByRole("button", { name: "Editar Centro" }),
  );
  await screen.findByRole("button", { name: "Tentar novamente" });
  await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
  expect(screen.getByRole("button", { name: "Nova filial" })).toBeEnabled();
  expect(gravacoes()).toHaveLength(0);
});

it("recusa obrigatórios só com espaços sem enviar à API", async () => {
  abrir();
  await preencherNovo();
  const nome = within(formulario()).getByRole("textbox", {
    name: "Nome",
  });
  await userEvent.clear(nome);
  await userEvent.type(nome, "   ");
  await userEvent.click(
    within(formulario()).getByRole("button", { name: "Salvar" }),
  );
  await screen.findByText("Preencha todos os campos obrigatórios.");
  expect(gravacoes()).toHaveLength(0);
});

it("recarrega o detalhe ao reabrir e permite preencher pelo teclado", async () => {
  abrir();
  await userEvent.click(
    await screen.findByRole("button", { name: "Editar Centro" }),
  );
  await screen.findByRole("textbox", { name: "Nome" });
  await userEvent.click(screen.getByRole("button", { name: "Fechar" }));
  expect(screen.getByRole("button", { name: "Nova filial" })).toHaveFocus();
  filiais[0].nome = "Centro atualizado";
  await userEvent.click(screen.getByRole("button", { name: "Editar Centro" }));
  const nome = await screen.findByRole("textbox", {
    name: "Nome",
  });
  expect(nome).toHaveValue("Centro atualizado");
  expect(nome).toHaveFocus();
  await userEvent.tab();
  expect(
    within(formulario()).getByRole("textbox", { name: "CNPJ" }),
  ).toHaveFocus();
  expect(
    within(formulario()).getByRole("combobox", {
      name: "Status da filial",
    }),
  ).toHaveAccessibleDescription(/suspendem novas reservas/);
});
