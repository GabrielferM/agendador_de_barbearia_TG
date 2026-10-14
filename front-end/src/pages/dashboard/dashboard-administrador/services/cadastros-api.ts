import {
  clienteControllerListar,
  clienteControllerBuscar,
  clienteControllerCriar,
  clienteControllerAtualizar,
  clienteControllerRemover,
} from "../../../../api/clientes/clientes";
import {
  filialControllerBuscar,
  filialControllerCriar,
  filialControllerAtualizar,
  filialControllerListar,
} from "../../../../api/filiais/filiais";
import {
  barbeiroControllerListar,
  barbeiroControllerBuscar,
  barbeiroControllerCriar,
  barbeiroControllerAtualizar,
  barbeiroControllerRemover,
} from "../../../../api/barbeiros/barbeiros";
import type {
  CriarClienteDto,
  AtualizarClienteDto,
  CriarBarbeiroDto,
  AtualizarBarbeiroDto,
  CriarFilialDto,
  AtualizarFilialDto,
  FilialControllerListarParams,
  BarbeiroControllerListarParams,
} from "../../../../api/models";
import {
  consultarDashboard,
  dinheiroValido,
  executarHttp,
  objeto,
  paginaValida,
  type Registro,
} from "./operacoes-api";
function filialValida(valor: unknown): Registro {
  if (
    !objeto(valor) ||
    !Number.isInteger(valor.id) ||
    typeof valor.nome !== "string" ||
    typeof valor.status !== "string" ||
    !objeto(valor.endereco) ||
    !["cep", "logradouro", "numero", "bairro", "cidade", "estado"].every(
      (campo) => typeof (valor.endereco as Registro)[campo] === "string",
    )
  )
    throw new Error("Filial inválida.");
  return valor;
}
export async function listarFiliais(
  params: FilialControllerListarParams,
  signal?: AbortSignal,
) {
  return paginaValida(
    await executarHttp(() => filialControllerListar(params, { signal })),
    (item) => !!filialValida(item),
  );
}
export const buscarFilial = async (id: number, signal?: AbortSignal) =>
  filialValida(
    await executarHttp(() => filialControllerBuscar(id, { signal })),
  );
export async function todasFiliais(signal?: AbortSignal) {
  const itens: Registro[] = [];
  let atual = 1;
  let paginas: number;
  do {
    const resposta = await listarFiliais(
      { pagina: atual, limite: 100 },
      signal,
    );
    itens.push(...resposta.data);
    paginas = resposta.meta.totalPaginas;
    atual++;
  } while (atual <= paginas);
  return itens;
}
export async function salvarFilial(id: number | null, dados: Registro) {
  const payload: Registro = {};
  const endereco: Registro = {};
  Object.entries(dados).forEach(([chave, valor]) => {
    if (chave.startsWith("endereco.")) endereco[chave.slice(9)] = valor;
    else if (chave !== "email" || valor !== "") payload[chave] = valor;
  });
  payload.endereco = endereco;
  return filialValida(
    await executarHttp(
      () =>
        id === null
          ? filialControllerCriar(payload as unknown as CriarFilialDto)
          : filialControllerAtualizar(id, payload as AtualizarFilialDto),
      id === null ? 201 : 200,
    ),
  );
}
export async function listarEquipe(
  idFilial: number,
  pagina: number,
  signal?: AbortSignal,
) {
  return paginaValida(
    await executarHttp(() =>
      barbeiroControllerListar(
        { idFilial, pagina, limite: 10 } as BarbeiroControllerListarParams,
        { signal },
      ),
    ),
    (item) =>
      item.idFilial === idFilial &&
      objeto(item.usuario) &&
      typeof item.usuario.nome === "string" &&
      typeof item.statusProfissional === "string",
  );
}

export async function listarBarbeiros(
  filtros: { pagina: number; busca?: string; status?: string },
  signal?: AbortSignal,
) {
  const valor = await consultarDashboard(
    "barbeiros",
    { ...filtros, limite: 10 },
    signal,
  );
  const pagina = paginaValida(
    valor,
    (item) =>
      typeof item.nome === "string" &&
      typeof item.status === "string" &&
      typeof item.filial === "string" &&
      dinheiroValido(item.receitaMes),
  );
  if (
    !objeto(pagina.indicadores) ||
    !Number.isInteger(pagina.indicadores.ativos) ||
    !Number.isInteger(pagina.indicadores.atendimentosMes) ||
    !dinheiroValido(pagina.indicadores.comissoesAPagar)
  )
    throw new Error("Indicadores inválidos.");
  return pagina;
}
function pessoaValida(valor: unknown): Registro {
  if (
    !objeto(valor) ||
    !Number.isInteger(valor.id) ||
    !objeto(valor.usuario) ||
    typeof valor.usuario.nome !== "string" ||
    typeof valor.usuario.email !== "string" ||
    typeof valor.usuario.status !== "string"
  )
    throw new Error("Cadastro inválido.");
  const { usuario } = valor;
  return {
    id: valor.id,
    nome: usuario.nome,
    email: usuario.email,
    statusUsuario: usuario.status,
    telefone: usuario.telefone,
    nomeProfissional: valor.nomeProfissional,
    idFilial: valor.idFilial,
    descricao: valor.descricao,
    fotoUrl: valor.fotoUrl,
    dataAdmissao: valor.dataAdmissao,
    statusProfissional: valor.statusProfissional,
    cpf: valor.cpf,
    dataNascimento: valor.dataNascimento,
    observacao: valor.observacao,
  };
}
export const buscarBarbeiro = async (id: number, signal?: AbortSignal) =>
  pessoaValida(
    await executarHttp(() => barbeiroControllerBuscar(id, { signal })),
  );
export async function salvarBarbeiro(id: number | null, dados: Registro) {
  return pessoaValida(
    await executarHttp(
      () =>
        id === null
          ? barbeiroControllerCriar(dados as unknown as CriarBarbeiroDto)
          : barbeiroControllerAtualizar(id, dados as AtualizarBarbeiroDto),
      id === null ? 201 : 200,
    ),
  );
}
export const excluirBarbeiro = (id: number) =>
  executarHttp(() => barbeiroControllerRemover(id), 200);

export async function listarClientes(
  filtros: { pagina: number; busca?: string; status?: string },
  signal?: AbortSignal,
) {
  const pagina = paginaValida(
    await consultarDashboard("clientes", { ...filtros, limite: 10 }, signal),
    (item) =>
      typeof item.nome === "string" &&
      typeof item.email === "string" &&
      typeof item.status === "string",
  );
  if (
    !objeto(pagina.indicadores) ||
    !["ativos", "novosNoMes", "retornoAgendado"].every((campo) =>
      Number.isInteger(pagina.indicadores?.[campo]),
    )
  )
    throw new Error("Indicadores inválidos.");
  return pagina;
}
export const buscarCliente = async (id: number, signal?: AbortSignal) =>
  pessoaValida(
    await executarHttp(() => clienteControllerBuscar(id, { signal })),
  );
export async function salvarCliente(id: number | null, dados: Registro) {
  return pessoaValida(
    await executarHttp(
      () =>
        id === null
          ? clienteControllerCriar(dados as unknown as CriarClienteDto)
          : clienteControllerAtualizar(id, dados as AtualizarClienteDto),
      id === null ? 201 : 200,
    ),
  );
}
export const excluirCliente = (id: number) =>
  executarHttp(() => clienteControllerRemover(id), 200);

export async function seletoresPessoas(
  tipo: "barbeiros" | "clientes",
  signal?: AbortSignal,
) {
  const itens: Registro[] = [];
  let pagina = 1;
  let total: number;
  do {
    const resposta = paginaValida(
      await executarHttp(() =>
        tipo === "barbeiros"
          ? barbeiroControllerListar({ pagina, limite: 100 }, { signal })
          : clienteControllerListar({ pagina, limite: 100 }, { signal }),
      ),
      (item) => objeto(item.usuario) && typeof item.usuario.nome === "string",
    );
    itens.push(
      ...resposta.data.map((item) => ({
        id: item.id,
        nome: (item.usuario as Registro).nome,
        idFilial: item.idFilial,
        status:
          tipo === "barbeiros"
            ? item.statusProfissional
            : (item.usuario as Registro).status,
        statusUsuario: (item.usuario as Registro).status,
      })),
    );
    total = resposta.meta.totalPaginas;
    pagina++;
  } while (pagina <= total);
  return itens;
}
