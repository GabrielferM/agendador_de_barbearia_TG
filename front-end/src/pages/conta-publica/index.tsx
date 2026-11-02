import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { CampoConta } from "./campo-conta";
import { enviarConta, ErroConta } from "./conta-api";
import { mascararCpf, mascararTelefone, validarCpf } from "./validacao-conta";

type Modo = "cadastro" | "recuperar" | "redefinir";
const titulos = {
  cadastro: "Crie sua conta",
  recuperar: "Esqueceu sua senha?",
  redefinir: "Defina uma nova senha",
};
const descricoes = {
  cadastro: "Seus próximos horários começam por aqui.",
  recuperar: "Informe seu e-mail para solicitar um link de recuperação.",
  redefinir: "Escolha uma senha para voltar a acessar sua conta.",
};

export function ContaPublica({ modo }: { modo: Modo }) {
  const location = useLocation();
  const retorno =
    location.state?.retorno === "/agendar"
      ? { retorno: "/agendar" }
      : undefined;
  const [token] = useState(() => {
    if (modo !== "redefinir") return "";
    return (
      new URLSearchParams(window.location.hash.slice(1)).get("token") ?? ""
    );
  });
  const [valores, setValores] = useState({
    nome: "",
    email: "",
    cpf: "",
    telefone: "",
    senha: "",
    confirmacao: "",
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [invalido, setInvalido] = useState(false);
  const [pendente, setPendente] = useState(false);
  const [espera, setEspera] = useState(0);
  const ocupado = useRef(false);
  const cadastro = modo === "cadastro";
  const senha = modo !== "recuperar";
  const tokenAusente =
    modo === "redefinir" && !/^[A-Za-z0-9_-]{43}$/.test(token);

  useEffect(() => {
    document.title = `${titulos[modo]} — Corte Certo`;
  }, [modo]);
  useEffect(() => {
    if (modo !== "redefinir") return;
    // Limpa o fragmento antes de qualquer operação e mantém o segredo só em memória.
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname,
    );
  }, [modo]);
  useEffect(() => {
    if (espera <= 0) return;
    const timer = window.setInterval(
      () => setEspera((valor) => Math.max(0, valor - 1)),
      1000,
    );
    return () => window.clearInterval(timer);
  }, [espera]);
  function atualizar(nome: keyof typeof valores, valor: string) {
    setValores((atual) => ({ ...atual, [nome]: valor }));
    setErros((atual) => ({ ...atual, [nome]: "" }));
  }
  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (ocupado.current || espera > 0) return;
    const novos: Record<string, string> = {};
    if (
      modo !== "redefinir" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.email.trim())
    )
      novos.email = "Informe um e-mail válido.";
    if (cadastro && valores.nome.trim().length < 2)
      novos.nome = "Informe seu nome com pelo menos 2 caracteres.";
    if (cadastro && !validarCpf(valores.cpf))
      novos.cpf = "Informe um CPF válido.";
    if (
      cadastro &&
      valores.telefone &&
      !/^\d{10,11}$/.test(valores.telefone.replace(/\D/g, ""))
    )
      novos.telefone = "Informe DDD e telefone com 10 ou 11 dígitos.";
    if (
      senha &&
      ([...valores.senha].length < 15 || [...valores.senha].length > 128)
    )
      novos.senha = "Use de 15 a 128 caracteres.";
    if (senha && valores.senha !== valores.confirmacao)
      novos.confirmacao = "As senhas devem ser iguais.";
    setErros(novos);
    if (Object.keys(novos).length) {
      evento.currentTarget
        .querySelector<HTMLInputElement>(
          `input[name="${["nome", "email", "cpf", "telefone", "senha", "confirmacao"].find((nome) => novos[nome])}"]`,
        )
        ?.focus();
      return;
    }
    ocupado.current = true;
    setPendente(true);
    setErro("");
    try {
      const dados: Record<string, string> = cadastro
        ? {
            nome: valores.nome.trim(),
            email: valores.email.trim(),
            cpf: valores.cpf.replace(/\D/g, ""),
            senha: valores.senha,
            ...(valores.telefone
              ? { telefone: valores.telefone.replace(/\D/g, "") }
              : {}),
          }
        : modo === "recuperar"
          ? { email: valores.email.trim() }
          : { token, senha: valores.senha };
      const resultado = await enviarConta(
        cadastro
          ? "cadastro-cliente"
          : modo === "recuperar"
            ? "recuperar-senha"
            : "redefinir-senha",
        dados,
      );
      setMensagem(resultado);
      setValores((atual) => ({ ...atual, senha: "", confirmacao: "" }));
      if (modo === "recuperar") setEspera(60);
    } catch (falha) {
      setErro(
        falha instanceof ErroConta
          ? falha.message
          : "O serviço está indisponível. Tente novamente.",
      );
      if (falha instanceof ErroConta) {
        if (falha.status === 429) setEspera(falha.espera);
        if (modo === "redefinir" && falha.status === 400) setInvalido(true);
      }
    } finally {
      ocupado.current = false;
      setPendente(false);
    }
  }
  const concluido = Boolean(mensagem) && modo !== "recuperar";
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
      <section
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-surface shadow-sm"
        aria-labelledby="titulo-conta"
      >
        <header className="bg-primary px-6 py-5 text-white sm:px-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded font-serif text-lg font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span aria-hidden="true">✂</span> CORTE CERTO
          </Link>
          <p className="mt-1 text-xs text-white">Seu estilo, no seu horário</p>
        </header>
        <div className="px-6 py-6 sm:px-8">
          <h1 id="titulo-conta" className="font-serif text-3xl font-bold">
            {titulos[modo]}
          </h1>
          <p className="mt-2 text-sm text-muted">{descricoes[modo]}</p>
          {tokenAusente && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-danger p-4 text-sm text-danger"
            >
              Link ausente ou inválido. Solicite outro link para continuar.
            </div>
          )}
          {mensagem && (
            <div
              role="status"
              className="mt-5 rounded-xl border border-success p-4 text-sm text-foreground"
            >
              {mensagem}
            </div>
          )}
          {erro && (
            <div
              role="alert"
              className="mt-5 rounded-xl border border-danger p-4 text-sm text-danger"
            >
              {erro}
            </div>
          )}
          {!concluido && !tokenAusente && !invalido && (
            <form
              onSubmit={enviar}
              noValidate
              className="mt-6 space-y-4"
              aria-busy={pendente}
            >
              {cadastro && (
                <CampoConta
                  nome="nome"
                  label="Nome"
                  autoComplete="name"
                  maxLength={120}
                  value={valores.nome}
                  erro={erros.nome}
                  onChange={(e) => atualizar("nome", e.target.value)}
                />
              )}
              {modo !== "redefinir" && (
                <CampoConta
                  nome="email"
                  label="E-mail"
                  type="email"
                  inputMode="email"
                  autoComplete={cadastro ? "username" : "email"}
                  autoCapitalize="none"
                  spellCheck={false}
                  maxLength={254}
                  value={valores.email}
                  erro={erros.email}
                  onChange={(e) => atualizar("email", e.target.value)}
                />
              )}
              {cadastro && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <CampoConta
                    nome="cpf"
                    label="CPF"
                    inputMode="numeric"
                    maxLength={14}
                    value={valores.cpf}
                    erro={erros.cpf}
                    onChange={(e) =>
                      atualizar("cpf", mascararCpf(e.target.value))
                    }
                  />
                  <CampoConta
                    nome="telefone"
                    label="Telefone (opcional)"
                    type="tel"
                    autoComplete="tel-national"
                    inputMode="tel"
                    maxLength={15}
                    value={valores.telefone}
                    erro={erros.telefone}
                    onChange={(e) =>
                      atualizar("telefone", mascararTelefone(e.target.value))
                    }
                  />
                </div>
              )}
              {senha && (
                <>
                  <CampoConta
                    nome="senha"
                    label={cadastro ? "Senha" : "Nova senha"}
                    senha
                    autoComplete="new-password"
                    value={valores.senha}
                    erro={erros.senha}
                    onChange={(e) => atualizar("senha", e.target.value)}
                  />
                  <p id="requisitos-senha" className="text-xs text-muted">
                    Use de 15 a 128 caracteres. Uma frase longa é uma boa opção.
                    Espaços são preservados.
                  </p>
                  <CampoConta
                    nome="confirmacao"
                    label="Confirmar senha"
                    senha
                    autoComplete="new-password"
                    value={valores.confirmacao}
                    erro={erros.confirmacao}
                    onChange={(e) => atualizar("confirmacao", e.target.value)}
                  />
                </>
              )}
              {cadastro && (
                <p className="text-xs text-muted">
                  Esta conta é exclusiva para clientes. O cadastro não verifica
                  a posse do e-mail informado.
                </p>
              )}
              <Button
                type="submit"
                isDisabled={pendente || espera > 0}
                className="w-full bg-primary font-bold text-white hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {pendente
                  ? "Enviando…"
                  : espera > 0
                    ? `Aguarde ${espera}s`
                    : cadastro
                      ? "Criar minha conta"
                      : modo === "recuperar"
                        ? mensagem
                          ? "Reenviar link de recuperação"
                          : "Enviar link de recuperação"
                        : "Salvar nova senha"}
              </Button>
            </form>
          )}
          {(tokenAusente || invalido) && (
            <Link
              to="/recuperar-senha"
              className="mt-5 block font-semibold text-primary underline"
            >
              Solicitar outro link
            </Link>
          )}
          <Link
            to="/login"
            state={retorno}
            className="mt-6 block text-center text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            {concluido ? "Ir para entrar" : "Voltar para entrar"}
          </Link>
        </div>
      </section>
    </main>
  );
}
