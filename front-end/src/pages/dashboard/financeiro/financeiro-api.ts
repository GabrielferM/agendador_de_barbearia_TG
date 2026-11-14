import {
  financeiroControllerConfigurar,
  financeiroControllerExtrato,
  financeiroControllerMinhas,
  financeiroControllerPagar,
  financeiroControllerTaxas,
} from "../../../api/financeiro/financeiro";
import type { FinanceiroControllerExtratoParams } from "../../../api/models";

export const statusComissao = [
  "PREVISTA",
  "LIBERADA",
  "PAGA",
  "CANCELADA",
  "ESTORNADA",
];
const decimal = (valor: unknown) =>
  typeof valor === "string" && /^\d+\.\d{2}$/.test(valor);
const data = (valor: unknown) =>
  typeof valor === "string" && Number.isFinite(Date.parse(valor));
function erro(status: number, mensagem: string) {
  return new Error(
    status === 403 ? "Você não possui acesso a esta operação." : mensagem,
  );
}

export async function consultarExtrato(
  admin: boolean,
  filtros: FinanceiroControllerExtratoParams,
  signal: AbortSignal,
) {
  const resposta = await (
    admin ? financeiroControllerExtrato : financeiroControllerMinhas
  )(filtros, { signal });
  if (resposta.status !== 200)
    throw erro(resposta.status, "Não foi possível consultar as comissões.");
  const extrato = resposta.data;
  if (
    !extrato ||
    ![
      extrato.aReceber,
      extrato.previstas,
      extrato.pagasNoPeriodo,
      extrato.geradasNoPeriodo,
    ].every(decimal) ||
    !Number.isSafeInteger(extrato.totalPaginas) ||
    !Array.isArray(extrato.itens) ||
    !extrato.itens.every(
      (item) =>
        item &&
        Number.isSafeInteger(item.id) &&
        typeof item.barbeiro === "string" &&
        typeof item.servico === "string" &&
        [item.baseCalculo, item.percentualAplicado, item.valorComissao].every(
          decimal,
        ) &&
        data(item.dataGeracao) &&
        (item.dataPagamento === null || data(item.dataPagamento)) &&
        statusComissao.includes(item.status),
    )
  )
    throw new Error("O servidor retornou um extrato inválido.");
  return extrato;
}

export async function consultarTaxas(pagina: number, signal: AbortSignal) {
  const resposta = await financeiroControllerTaxas(
    { pagina, limite: 10 },
    { signal },
  );
  if (resposta.status !== 200)
    throw erro(resposta.status, "Não foi possível consultar os percentuais.");
  const taxas = resposta.data;
  if (
    !taxas ||
    !Number.isSafeInteger(taxas.totalPaginas) ||
    !Array.isArray(taxas.itens) ||
    !taxas.itens.every(
      (item) =>
        item &&
        Number.isSafeInteger(item.id) &&
        typeof item.nome === "string" &&
        (item.percentual === null || decimal(item.percentual)),
    )
  )
    throw new Error("O servidor retornou percentuais inválidos.");
  return taxas;
}

export async function registrarRepasse(id: number) {
  const resposta = await financeiroControllerPagar(id);
  if (resposta.status !== 200)
    throw erro(
      resposta.status,
      resposta.status === 409
        ? "A comissão não está liberada para repasse. Atualize o extrato."
        : "Não foi possível confirmar o registro. Consulte o extrato antes de tentar novamente.",
    );
  if (
    resposta.data?.idComissao !== id ||
    !decimal(resposta.data.valor) ||
    !data(resposta.data.dataRegistro)
  )
    throw new Error(
      "Não foi possível confirmar o registro. Consulte o extrato.",
    );
}

export async function configurarTaxa(id: number, percentual: number) {
  const resposta = await financeiroControllerConfigurar(id, { percentual });
  if (resposta.status !== 204)
    throw erro(resposta.status, "Não foi possível salvar o percentual.");
}

export function periodoFinanceiroAtual() {
  const hoje = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
  }).format(new Date());
  return { inicioDe: hoje.slice(0, 7) + "-01", inicioAte: hoje };
}
