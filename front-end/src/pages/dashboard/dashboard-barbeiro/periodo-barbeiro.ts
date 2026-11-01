export const STATUS_AGENDA = [
  "PENDENTE",
  "CONFIRMADO",
  "EM_ATENDIMENTO",
  "CONCLUIDO",
  "CANCELADO",
  "NAO_COMPARECEU",
] as const;
export const hojeBrasilia = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
export const campoBarbeiro =
  "mt-1 block h-10 w-full rounded-lg border border-border bg-surface px-3 text-sm focus-visible:outline-primary";
export function validarFiltros(params: URLSearchParams, historico = false) {
  const hoje = hojeBrasilia();
  const de = params.get("de") ?? (historico ? hoje.slice(0, 7) + "-01" : hoje);
  const ate = params.get("ate") ?? (historico ? hoje : de);
  const paginaTexto = params.get("pagina") ?? "1";
  const pagina = Number(paginaTexto);
  const status = params.get("status") ?? "";
  const dia = (v: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(v) &&
    Number.isFinite(Date.parse(v)) &&
    new Date(v).toISOString().slice(0, 10) === v;
  const idCliente = params.get("cliente");
  const estados: readonly string[] = historico
    ? ["CONCLUIDO", "CANCELADO", "NAO_COMPARECEU"]
    : STATUS_AGENDA;
  const erro =
    !dia(de) ||
    !dia(ate) ||
    ate < de ||
    Date.parse(ate) - Date.parse(de) >= 366 * 86400000 ||
    !/^[1-9]\d*$/.test(paginaTexto) ||
    !Number.isSafeInteger(pagina) ||
    (status !== "" && !estados.includes(status)) ||
    (idCliente !== null &&
      (!/^[1-9]\d*$/.test(idCliente) ||
        !Number.isSafeInteger(Number(idCliente))))
      ? "Confira as datas, situação e página dos filtros. O período máximo é de 366 dias."
      : null;
  return {
    de,
    ate,
    pagina,
    status,
    idCliente: idCliente ? Number(idCliente) : undefined,
    erro,
  };
}

export const horaBarbeiro = (v: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(v));
export const dataCurtaBarbeiro = (v: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
  }).format(
    new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T12:00:00-03:00` : v),
  );
