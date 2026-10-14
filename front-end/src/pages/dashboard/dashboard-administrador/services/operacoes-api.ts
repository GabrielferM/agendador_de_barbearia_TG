import { apiBaseUrl } from "../../../../api/client";
import { httpClient } from "../../../../api/http-client";
import { executarHttp } from "../../../../api/operacao-http";
export { executarHttp } from "../../../../api/operacao-http";
export type Registro = Record<string, unknown>;
export interface PaginaRegistros {
  data: Registro[];
  meta: { pagina: number; total: number; totalPaginas: number };
  indicadores?: Registro;
}
export const objeto = (valor: unknown): valor is Registro =>
  !!valor && typeof valor === "object" && !Array.isArray(valor);
export async function consultarDashboard(
  caminho: string,
  filtros: Record<string, string | number | undefined>,
  signal?: AbortSignal,
) {
  const params = new URLSearchParams();
  Object.entries(filtros).forEach(([chave, valor]) => {
    if (valor !== undefined && valor !== "") params.set(chave, String(valor));
  });
  return executarHttp(() =>
    httpClient<{ data: unknown; status: number; headers: Headers }>(
      `${apiBaseUrl}/dashboard/administrador/${caminho}?${params}`,
      { method: "GET", signal },
    ),
  );
}
export function paginaValida(
  valor: unknown,
  validar: (item: Registro) => boolean,
): PaginaRegistros {
  if (
    !objeto(valor) ||
    !Array.isArray(valor.data) ||
    !valor.data.every(
      (item) => objeto(item) && Number.isInteger(item.id) && validar(item),
    ) ||
    !objeto(valor.meta) ||
    !Number.isInteger(valor.meta.total) ||
    !Number.isInteger(valor.meta.totalPaginas) ||
    !Number.isInteger(valor.meta.pagina) ||
    Number(valor.meta.total) < 0
  )
    throw new Error("A API retornou uma lista inválida.");
  return valor as unknown as PaginaRegistros;
}
export const texto = (valor: unknown) =>
  typeof valor === "string" ? valor : "";
export const dinheiroValido = (valor: unknown) =>
  (typeof valor === "number" || typeof valor === "string") &&
  Number.isFinite(Number(valor));
