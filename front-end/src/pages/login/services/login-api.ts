import { autenticacaoControllerLogin } from "../../../api/autenticação/autenticação";
import {
  CODIGOS_PAPEL,
  type CredenciaisLogin,
  type RespostaLogin,
  type TipoErroLogin,
} from "../types";

const MENSAGEM_CREDENCIAIS =
  "Não foi possível entrar. Verifique seus dados e tente novamente.";
const MENSAGEM_INDISPONIVEL =
  "O acesso está indisponível no momento. Tente novamente mais tarde.";

export class ErroLogin extends Error {
  readonly tipo: TipoErroLogin;
  readonly tentarNovamenteEm?: number;

  constructor(
    tipo: TipoErroLogin,
    mensagem: string,
    tentarNovamenteEm?: number,
  ) {
    super(mensagem);
    this.name = "ErroLogin";
    this.tipo = tipo;
    this.tentarNovamenteEm = tentarNovamenteEm;
  }
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function ehRespostaLogin(valor: unknown): valor is RespostaLogin {
  if (!ehObjeto(valor) || !ehObjeto(valor.usuario)) return false;

  const { usuario } = valor;
  return (
    typeof usuario.id === "number" &&
    typeof usuario.nome === "string" &&
    typeof usuario.email === "string" &&
    typeof usuario.papel === "string" &&
    CODIGOS_PAPEL.includes(usuario.papel as (typeof CODIGOS_PAPEL)[number]) &&
    (usuario.permissoes === undefined || Array.isArray(usuario.permissoes))
  );
}

function obterTempoDeEspera(resposta: Response): number | undefined {
  const cabecalho = resposta.headers.get("Retry-After");
  if (!cabecalho) return undefined;

  const segundos = Number(cabecalho);
  if (Number.isFinite(segundos) && segundos >= 0) return Math.ceil(segundos);

  const data = Date.parse(cabecalho);
  if (Number.isNaN(data)) return undefined;

  return Math.max(0, Math.ceil((data - Date.now()) / 1000));
}

export async function autenticar(
  credenciais: CredenciaisLogin,
): Promise<RespostaLogin> {
  let resposta: Awaited<ReturnType<typeof autenticacaoControllerLogin>>;

  try {
    resposta = await autenticacaoControllerLogin({
      email: credenciais.email.trim(),
      senha: credenciais.senha,
    });
  } catch {
    throw new ErroLogin("indisponivel", MENSAGEM_INDISPONIVEL);
  }

  const status = resposta.status as number;
  if (status === 401 || status === 403) {
    throw new ErroLogin("credenciais", MENSAGEM_CREDENCIAIS);
  }

  if (status === 429) {
    const tentarNovamenteEm = obterTempoDeEspera(
      new Response(null, { headers: resposta.headers }),
    );
    const complemento = tentarNovamenteEm
      ? ` Aguarde ${tentarNovamenteEm} segundos.`
      : "";
    throw new ErroLogin(
      "limite",
      `Muitas tentativas de acesso.${complemento}`.trim(),
      tentarNovamenteEm,
    );
  }

  if (status < 200 || status >= 300) {
    throw new ErroLogin("indisponivel", MENSAGEM_INDISPONIVEL);
  }

  const dados: unknown = resposta.data;

  if (!ehRespostaLogin(dados)) {
    throw new ErroLogin("resposta-invalida", MENSAGEM_INDISPONIVEL);
  }

  return {
    ...dados,
    usuario: { ...dados.usuario, permissoes: dados.usuario.permissoes ?? [] },
  };
}
