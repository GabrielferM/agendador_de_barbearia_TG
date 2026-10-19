import {
  catalogoPublicoControllerBarbeiros,
  catalogoPublicoControllerServicos,
} from "../../../api/catálogo-público/catálogo-público";
import type { BarbeiroPublicoDto, ServicoPublicoDto } from "../../../api/models";

const objeto = (valor: unknown): valor is Record<string, unknown> =>
  typeof valor === "object" && valor !== null;
const textoOpcional = (valor: unknown) => valor == null || typeof valor === "string";

async function todas<T>(
  buscar: (pagina: number) => Promise<{ status: number; data: unknown }>,
  validar: (item: unknown) => boolean,
): Promise<T[]> {
  const itens: T[] = [];
  let totalPaginas = 1;
  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    const resposta = await buscar(pagina);
    const corpo = resposta.data;
    if (resposta.status !== 200 || !objeto(corpo) ||
      !Array.isArray(corpo.data) || !corpo.data.every(validar) ||
      !objeto(corpo.meta) || corpo.meta.pagina !== pagina ||
      !Number.isInteger(corpo.meta.totalPaginas) || Number(corpo.meta.totalPaginas) < 0 ||
      (Number(corpo.meta.totalPaginas) < pagina && corpo.data.length > 0)) {
      throw new Error("Não foi possível carregar o catálogo.");
    }
    totalPaginas = Number(corpo.meta.totalPaginas);
    itens.push(...corpo.data as T[]);
  }
  return itens;
}

export const buscarServicosInicio = (signal?: AbortSignal) => todas<ServicoPublicoDto>(
  (pagina) => catalogoPublicoControllerServicos({ pagina, limite: 100 }, { signal }),
  (item) => objeto(item) && Number.isInteger(item.id) && typeof item.nome === "string" &&
    typeof item.precoBase === "string" && item.precoBase.trim() !== "" && Number.isFinite(Number(item.precoBase)) &&
    typeof item.duracaoMinutos === "number" && Number.isFinite(item.duracaoMinutos),
);
export const buscarBarbeirosInicio = (signal?: AbortSignal) => todas<BarbeiroPublicoDto>(
  (pagina) => catalogoPublicoControllerBarbeiros({ pagina, limite: 100 }, { signal }),
  (item) => objeto(item) && Number.isInteger(item.id) && typeof item.nomeProfissional === "string" &&
    textoOpcional(item.descricao) && textoOpcional(item.fotoUrl),
);
