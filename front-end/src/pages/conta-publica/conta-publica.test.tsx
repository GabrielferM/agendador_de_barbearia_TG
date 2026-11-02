import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ContaPublica } from ".";
import { enviarConta, ErroConta } from "./conta-api";
import { validarCpf } from "./validacao-conta";

function json(
  dados: unknown,
  status = 200,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}
function renderizar(modo: "cadastro" | "recuperar" | "redefinir") {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: "/", state: { retorno: "/agendar" } }]}
    >
      <ContaPublica modo={modo} />
    </MemoryRouter>,
  );
}
async function preencherCadastro() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nome"), "Cliente Teste");
  await user.type(screen.getByLabelText("E-mail"), "cliente@example.com");
  await user.type(screen.getByLabelText("CPF"), "52998224725");
  await user.type(screen.getByLabelText("Telefone (opcional)"), "16999998888");
  await user.type(screen.getByLabelText("Senha"), " senha longa segura ");
  await user.type(
    screen.getByLabelText("Confirmar senha"),
    " senha longa segura ",
  );
  return user;
}
beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  window.history.replaceState({}, "", "/");
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("Telas públicas de conta", () => {
  it("valida por campo e não chama a API com CPF/senha inválidos", async () => {
    renderizar("cadastro");
    await userEvent.click(
      screen.getByRole("button", { name: "Criar minha conta" }),
    );
    expect(screen.getByLabelText("CPF")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
    expect(screen.getByLabelText("Nome")).toHaveFocus();
    expect(fetch).not.toHaveBeenCalled();
    expect(validarCpf("11111111111")).toBe(false);
  });
  it("envia campos permitidos, remove máscaras, preserva senha e confirma sem autenticar", async () => {
    vi.mocked(fetch).mockResolvedValue(
      json({ mensagem: "Conta criada. Entre para continuar." }),
    );
    renderizar("cadastro");
    const user = await preencherCadastro();
    await user.click(screen.getByRole("button", { name: "Mostrar senha" }));
    expect(screen.getByLabelText("Senha")).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Criar minha conta" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Conta criada");
    expect(fetch).toHaveBeenCalledTimes(1);
    const opcoes = vi.mocked(fetch).mock.calls[0][1]!;
    expect(JSON.parse(opcoes.body as string)).toEqual({
      nome: "Cliente Teste",
      email: "cliente@example.com",
      cpf: "52998224725",
      telefone: "16999998888",
      senha: " senha longa segura ",
    });
    expect(
      screen.getByRole("link", { name: "Ir para entrar" }),
    ).toHaveAttribute("href", "/login");
  });
  it("impede envio duplicado enquanto aguarda e preserva campos após conflito", async () => {
    let resolver!: (resposta: Response) => void;
    vi.mocked(fetch).mockReturnValue(
      new Promise((resolve) => {
        resolver = resolve;
      }),
    );
    renderizar("cadastro");
    await preencherCadastro();
    const botao = screen.getByRole("button", { name: "Criar minha conta" });
    fireEvent.submit(botao.closest("form")!);
    fireEvent.submit(botao.closest("form")!);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(
      await screen.findByRole("button", { name: "Enviando…" }),
    ).toBeDisabled();
    resolver(json({}, 409));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível criar",
    );
    expect(screen.getByLabelText("Senha")).toHaveValue(" senha longa segura ");
  });
  it("recuperação usa resposta genérica e intervalo de reenvio", async () => {
    vi.mocked(fetch).mockResolvedValue(
      json({
        mensagem:
          "Se houver uma conta elegível com esse e-mail, enviaremos as instruções para redefinir sua senha.",
      }),
    );
    renderizar("recuperar");
    await userEvent.type(
      screen.getByLabelText("E-mail"),
      "cliente@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Enviar link de recuperação" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Se houver uma conta elegível",
    );
    expect(screen.getByRole("button", { name: /Aguarde/ })).toBeDisabled();
  });
  it("sem token apresenta ação para obter outro e não envia requisição", () => {
    renderizar("redefinir");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Link ausente ou inválido",
    );
    expect(
      screen.getByRole("link", { name: "Solicitar outro link" }),
    ).toHaveAttribute("href", "/recuperar-senha");
    expect(fetch).not.toHaveBeenCalled();
  });
  it("somente confirmação consome o token; remove fragmento e trata token expirado", async () => {
    window.history.replaceState(
      {},
      "",
      "/redefinir-senha#token=" + "t".repeat(43),
    );
    vi.mocked(fetch).mockResolvedValue(json({}, 400));
    renderizar("redefinir");
    expect(window.location.hash).toBe("");
    expect(fetch).not.toHaveBeenCalled();
    await userEvent.type(
      screen.getByLabelText("Nova senha"),
      "nova senha muito longa",
    );
    await userEvent.type(
      screen.getByLabelText("Confirmar senha"),
      "nova senha muito longa",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Salvar nova senha" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Link inválido, expirado ou já utilizado",
    );
    expect(
      screen.getByRole("link", { name: "Solicitar outro link" }),
    ).toBeInTheDocument();
    expect(
      JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string),
    ).toEqual({ token: "t".repeat(43), senha: "nova senha muito longa" });
  });
  it("mostra sucesso de redefinição com volta para login", async () => {
    window.history.replaceState(
      {},
      "",
      "/redefinir-senha#token=" + "t".repeat(43),
    );
    vi.mocked(fetch).mockResolvedValue(
      json({ mensagem: "Senha alterada. Entre com sua nova senha." }),
    );
    renderizar("redefinir");
    for (const label of ["Nova senha", "Confirmar senha"])
      await userEvent.type(
        screen.getByLabelText(label),
        "nova senha muito longa",
      );
    await userEvent.click(
      screen.getByRole("button", { name: "Salvar nova senha" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Senha alterada",
    );
    expect(
      screen.getByRole("link", { name: "Ir para entrar" }),
    ).toBeInTheDocument();
  });
  it("respeita limite informado em Retry-After e mantém o e-mail", async () => {
    vi.mocked(fetch).mockResolvedValue(json({}, 429, { "Retry-After": "120" }));
    renderizar("recuperar");
    await userEvent.type(
      screen.getByLabelText("E-mail"),
      "cliente@example.com",
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Enviar link de recuperação" }),
    );
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: "Aguarde 120s" }),
      ).toBeDisabled(),
    );
    expect(screen.getByLabelText("E-mail")).toHaveValue("cliente@example.com");
  });
});

describe("Adapter HTTP", () => {
  it.each([403, 500, 503])(
    "não aceita erro HTTP %s como sucesso",
    async (status) => {
      vi.mocked(fetch).mockResolvedValue(json({}, status));
      await expect(
        enviarConta("recuperar-senha", { email: "cliente@example.com" }),
      ).rejects.toBeInstanceOf(ErroConta);
    },
  );
  it("trata falha de rede e resposta de sucesso malformada", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("rede"));
    await expect(enviarConta("recuperar-senha", {})).rejects.toThrow(
      "Não foi possível conectar",
    );
    vi.mocked(fetch).mockResolvedValueOnce(json({}));
    await expect(enviarConta("recuperar-senha", {})).rejects.toThrow(
      "indisponível",
    );
  });
});
