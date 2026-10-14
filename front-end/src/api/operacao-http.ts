// Adapter manual: não pertence à geração Orval.
export class ErroOperacao extends Error {
  readonly status: number;
  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}
let aguardarAte = 0;
export async function executarHttp(
  operacao: () => Promise<{ status: number; data: unknown; headers: Headers }>,
  esperado = 200,
): Promise<unknown> {
  if (Date.now() < aguardarAte)
    throw new ErroOperacao(
      429,
      "Aguarde o limite de consultas antes de tentar novamente.",
    );
  const resposta = await operacao();
  if (resposta.status === 429) {
    const espera = resposta.headers.get("Retry-After");
    const segundos =
      espera && /^\d+$/.test(espera)
        ? Number(espera)
        : espera
          ? Math.max(0, (Date.parse(espera) - Date.now()) / 1000)
          : 30;
    aguardarAte =
      Date.now() +
      (Number.isFinite(segundos) ? Math.max(1, segundos) : 30) * 1000;
  }
  if (resposta.status !== esperado) {
    const mensagens: Record<number, string> = {
      400: "Revise os campos e as regras desta operação.",
      401: "Entre na sua conta para continuar.",
      403: "Você não possui permissão para esta operação.",
      404: "Registro não disponível.",
      409: "O registro mudou, já existe ou possui vínculos que impedem esta operação.",
      429: "Muitas solicitações. Aguarde antes de tentar novamente.",
    };
    throw new ErroOperacao(
      resposta.status,
      mensagens[resposta.status] ??
        "Não foi possível concluir a operação. Consulte os dados antes de repetir uma gravação.",
    );
  }
  return resposta.data;
}
