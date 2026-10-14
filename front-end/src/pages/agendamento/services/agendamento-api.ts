import {
  catalogoPublicoControllerFiliais,
  catalogoPublicoControllerBarbeiros,
  catalogoPublicoControllerServicos,
} from "../../../api/catálogo-público/catálogo-público";
import {
  agendamentoControllerHorarios,
  agendamentoControllerCriar,
  agendamentoControllerListar,
  agendamentoControllerAtualizar,
  agendamentoControllerBuscar,
} from "../../../api/agendamentos/agendamentos";
import type {
  AgendamentoRespostaDto,
  BarbeiroPublicoDto,
  FilialPublicaDto,
  ServicoPublicoDto,
  HorariosDisponiveisRespostaDto,
  AgendamentoControllerHorariosParams,
  CriarAgendamentoDto,
  MetaPaginacaoDto,
  AgendamentoControllerListarParams,
} from "../../../api/models";

export class ErroAgendamento extends Error {
  status: number;
  constructor(status: number, mensagem: string) {
    super(mensagem);
    this.status = status;
  }
}
function conferir(
  resposta: { status: number; data: unknown },
  esperado = 200,
): unknown {
  if (resposta.status !== esperado) {
    const mensagens: Record<number, string> = {
      400: "As escolhas não são mais válidas. Revise a filial, os serviços e o horário.",
      401: "Entre na sua conta para continuar.",
      403: "Você não tem acesso a esta operação.",
      404: "Um dos itens não está mais disponível. Revise suas escolhas.",
      409: "A agenda foi atualizada. Escolha outro horário ou atualize seus agendamentos.",
      429: "Muitas tentativas. Aguarde antes de tentar novamente.",
    };
    throw new ErroAgendamento(
      resposta.status,
      mensagens[resposta.status] ??
        "Não foi possível acessar a agenda. Tente novamente.",
    );
  }
  return resposta.data;
}
function objeto(valor: unknown): valor is Record<string, unknown> {
  return !!valor && typeof valor === "object";
}
function invalida(): never {
  throw new Error("A API retornou uma resposta inválida.");
}
function pagina<T>(
  valor: unknown,
  validar: (item: unknown) => boolean,
): { data: T[]; meta: MetaPaginacaoDto } {
  if (
    !objeto(valor) ||
    !Array.isArray(valor.data) ||
    !valor.data.every(validar) ||
    !objeto(valor.meta) ||
    !Number.isInteger(valor.meta.totalPaginas) ||
    !Number.isInteger(valor.meta.total) ||
    !Number.isInteger(valor.meta.pagina)
  )
    return invalida();
  return valor as { data: T[]; meta: MetaPaginacaoDto };
}
async function todas<T>(
  buscar: (pagina: number) => Promise<{ data: unknown; status: number }>,
  validar: (item: unknown) => boolean,
): Promise<T[]> {
  const itens: T[] = [];
  let atual = 1;
  let total: number;
  do {
    const resposta = pagina<T>(conferir(await buscar(atual)), validar);
    itens.push(...resposta.data);
    total = resposta.meta.totalPaginas;
    atual++;
  } while (atual <= total);
  return itens;
}
const nomeValido = (item: unknown) =>
  objeto(item) && Number.isInteger(item.id) && typeof item.nome === "string";
export const buscarFiliais = (signal?: AbortSignal) =>
  todas<FilialPublicaDto>(
    (pagina) =>
      catalogoPublicoControllerFiliais({ pagina, limite: 100 }, { signal }),
    (item) =>
      nomeValido(item) &&
      objeto(item) &&
      objeto(item.endereco) &&
      typeof item.endereco.logradouro === "string",
  );
export const buscarServicos = (signal?: AbortSignal) =>
  todas<ServicoPublicoDto>(
    (pagina) =>
      catalogoPublicoControllerServicos({ pagina, limite: 100 }, { signal }),
    (item) =>
      nomeValido(item) &&
      objeto(item) &&
      typeof item.precoBase === "string" &&
      Number.isFinite(Number(item.precoBase)) &&
      typeof item.duracaoMinutos === "number",
  );
export const buscarBarbeiros = (idFilial: number, signal?: AbortSignal) =>
  todas<BarbeiroPublicoDto>(
    (pagina) =>
      catalogoPublicoControllerBarbeiros(
        { pagina, limite: 100, idFilial },
        { signal },
      ),
    (item) =>
      objeto(item) &&
      Number.isInteger(item.id) &&
      item.idFilial === idFilial &&
      typeof item.nomeProfissional === "string",
  );
export async function buscarHorarios(
  params: AgendamentoControllerHorariosParams,
  signal?: AbortSignal,
): Promise<HorariosDisponiveisRespostaDto> {
  const valor = conferir(
    await agendamentoControllerHorarios(params, { signal }),
  );
  if (
    !objeto(valor) ||
    typeof valor.fuso !== "string" ||
    typeof valor.valorTotal !== "string" ||
    !Number.isFinite(Number(valor.valorTotal)) ||
    typeof valor.duracaoTotalMinutos !== "number" ||
    !Array.isArray(valor.horarios) ||
    !valor.horarios.every(
      (item: unknown) =>
        objeto(item) &&
        typeof item.inicio === "string" &&
        Number.isFinite(Date.parse(item.inicio)) &&
        typeof item.fim === "string" &&
        Number.isFinite(Date.parse(item.fim)),
    )
  )
    return invalida();
  return valor as unknown as HorariosDisponiveisRespostaDto;
}
function agendamentoValido(item: unknown): boolean {
  return (
    objeto(item) &&
    Number.isInteger(item.id) &&
    typeof item.inicioPrevisto === "string" &&
    typeof item.fimPrevisto === "string" &&
    typeof item.status === "string" &&
    objeto(item.filial) &&
    objeto(item.filial.endereco) &&
    objeto(item.barbeiro) &&
    Array.isArray(item.servicos) &&
    item.servicos.every(
      (servico: unknown) =>
        objeto(servico) &&
        typeof servico.subtotal === "string" &&
        Number.isFinite(Number(servico.subtotal)) &&
        typeof servico.quantidade === "number" &&
        typeof servico.duracaoAplicadaMinutos === "number" &&
        objeto(servico.servico) &&
        typeof servico.servico.nome === "string",
    )
  );
}
export async function criarAgendamento(
  dto: CriarAgendamentoDto,
): Promise<AgendamentoRespostaDto> {
  const valor = conferir(await agendamentoControllerCriar(dto), 201);
  if (!agendamentoValido(valor)) return invalida();
  return valor as AgendamentoRespostaDto;
}
export async function listarAgendamentos(
  paginaAtual: number,
  signal?: AbortSignal,
  filtros: Omit<AgendamentoControllerListarParams, "pagina" | "limite"> = {},
) {
  return pagina<AgendamentoRespostaDto>(
    conferir(
      await agendamentoControllerListar(
        { ...filtros, pagina: paginaAtual, limite: 10 },
        { signal },
      ),
    ),
    agendamentoValido,
  );
}
export async function cancelarAgendamento(
  id: number,
  motivoCancelamento: string,
) {
  const valor = conferir(
    await agendamentoControllerAtualizar(id, {
      status: "CANCELADO",
      motivoCancelamento,
    }),
  );
  if (!agendamentoValido(valor)) return invalida();
  return valor as AgendamentoRespostaDto;
}
export const mensagemErro = (erro: unknown) =>
  erro instanceof ErroAgendamento
    ? erro.message
    : "Não foi possível carregar os dados. Tente novamente.";

export async function buscarMeuAgendamento(id: number, signal?: AbortSignal) {
  const valor = conferir(await agendamentoControllerBuscar(id, { signal }));
  if (!agendamentoValido(valor)) return invalida();
  return valor as AgendamentoRespostaDto;
}
