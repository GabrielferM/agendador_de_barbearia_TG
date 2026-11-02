import {
  autenticacaoControllerCadastrarCliente,
  autenticacaoControllerRecuperarSenha,
  autenticacaoControllerRedefinirSenha,
} from "../../api/autenticação/autenticação";

export class ErroConta extends Error {
  readonly status: number;
  readonly espera: number;
  constructor(mensagem: string, status = 0, espera = 0) {
    super(mensagem);
    this.status = status;
    this.espera = espera;
  }
}
export async function enviarConta(
  rota: "cadastro-cliente" | "recuperar-senha" | "redefinir-senha",
  dados: Record<string, string>,
) {
  let resposta: { status: number; data: unknown; headers: Headers };
  try {
    const opcoes: RequestInit = {
      cache: "no-store",
      referrerPolicy: "no-referrer",
    };
    resposta =
      rota === "cadastro-cliente"
        ? await autenticacaoControllerCadastrarCliente(
            {
              nome: dados.nome,
              email: dados.email,
              cpf: dados.cpf,
              senha: dados.senha,
              ...(dados.telefone ? { telefone: dados.telefone } : {}),
            },
            opcoes,
          )
        : rota === "recuperar-senha"
          ? await autenticacaoControllerRecuperarSenha(
              { email: dados.email },
              opcoes,
            )
          : await autenticacaoControllerRedefinirSenha(
              { token: dados.token, senha: dados.senha },
              opcoes,
            );
  } catch {
    throw new ErroConta(
      "Não foi possível conectar. Verifique sua conexão e tente novamente.",
    );
  }
  const { status } = resposta;
  if (status === 429) {
    const valor = resposta.headers.get("Retry-After");
    const segundos =
      valor && /^\d+$/.test(valor)
        ? Number(valor)
        : valor
          ? Math.ceil((Date.parse(valor) - Date.now()) / 1000)
          : 60;
    throw new ErroConta(
      "Muitas solicitações. Aguarde para tentar novamente.",
      status,
      Number.isFinite(segundos) ? Math.max(1, segundos) : 60,
    );
  }
  if (status === 409)
    throw new ErroConta(
      "Não foi possível criar a conta com os dados informados. Se já possui conta, entre ou recupere sua senha.",
      status,
    );
  if (status === 400)
    throw new ErroConta(
      rota === "redefinir-senha"
        ? "Link inválido, expirado ou já utilizado. Solicite outro link."
        : "Confira os dados informados, incluindo o CPF e os requisitos de senha.",
      status,
    );
  if (
    status !== 200 ||
    !resposta.data ||
    typeof resposta.data !== "object" ||
    !("mensagem" in resposta.data) ||
    typeof resposta.data.mensagem !== "string"
  )
    throw new ErroConta(
      "O serviço está indisponível. Tente novamente mais tarde.",
      status,
    );
  return resposta.data.mensagem;
}
