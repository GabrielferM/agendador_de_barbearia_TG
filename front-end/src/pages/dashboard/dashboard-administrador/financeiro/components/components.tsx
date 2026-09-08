import { Cartao } from "../../../components/dashboard-compartilhado";
import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
  BotaoIndisponivel,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type {
  ComissaoBarbeiro,
  FormaPagamento,
  Movimentacao,
  SemanaFinanceira,
} from "../types";

export function IndicadoresFinanceiros() {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <IndicadorSimples
        titulo="Receita do mês"
        valor={moeda.format(32480)}
        detalhe="↑ 12% em relação ao mês anterior"
        icone="financeiro"
      />
      <IndicadorSimples
        titulo="Despesas"
        valor={moeda.format(8760)}
        detalhe="↑ 8% em relação ao mês anterior"
      />
      <IndicadorSimples
        titulo="Lucro líquido"
        valor={moeda.format(23720)}
        detalhe="↑ 14% em relação ao mês anterior"
      />
      <IndicadorSimples
        titulo="Comissões"
        valor={moeda.format(6496)}
        detalhe="↑ 10% em relação ao mês anterior"
        icone="usuarios"
      />
    </div>
  );
}

export function FluxoFinanceiro({ semanas }: { semanas: SemanaFinanceira[] }) {
  const maximo = Math.max(...semanas.map((item) => item.receita));
  return (
    <Cartao titulo="Fluxo financeiro">
      <div className="flex h-64 items-end justify-around gap-4">
        {semanas.map((item) => (
          <div key={item.rotulo} className="flex flex-1 flex-col items-center">
            <div className="flex h-44 items-end gap-1">
              <div
                title={`Receita ${moeda.format(item.receita)}`}
                className="w-8 rounded-t bg-secondary sm:w-12"
                style={{ height: `${(item.receita / maximo) * 100}%` }}
              />
              <div
                title={`Despesas ${moeda.format(item.despesas)}`}
                className="w-8 rounded-t bg-primary sm:w-12"
                style={{ height: `${(item.despesas / maximo) * 100}%` }}
              />
            </div>
            <strong className="mt-2 text-xs">{item.rotulo}</strong>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-5 text-xs text-muted">
        <span>● Receita</span>
        <span>● Despesas</span>
      </div>
    </Cartao>
  );
}

export function FormasPagamento({ formas }: { formas: FormaPagamento[] }) {
  return (
    <Cartao titulo="Receita por forma de pagamento">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-around">
        <div
          className="grid size-52 place-items-center rounded-full"
          style={{
            background:
              "conic-gradient(var(--primary) 0 46%, var(--secondary) 46% 85%, var(--border) 85% 100%)",
          }}
        >
          <div className="grid size-28 place-items-center rounded-full bg-surface text-center">
            <div>
              <strong>{moeda.format(32480)}</strong>
              <p className="text-xs text-muted">Total</p>
            </div>
          </div>
        </div>
        <ul className="space-y-4">
          {formas.map((item) => (
            <li
              key={item.nome}
              className="grid grid-cols-[1fr_auto] gap-x-6 text-sm"
            >
              <strong>{item.nome}</strong>
              <strong>{item.percentual}%</strong>
              <span className="text-muted">{moeda.format(item.valor)}</span>
            </li>
          ))}
        </ul>
      </div>
    </Cartao>
  );
}

export function TabelaMovimentacoes({ itens }: { itens: Movimentacao[] }) {
  return (
    <Cartao titulo="Movimentações recentes" className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-left text-xs">
          <thead className="text-muted">
            <tr>
              {[
                "Data",
                "Descrição",
                "Categoria",
                "Forma",
                "Valor",
                "Status",
              ].map((item) => (
                <th
                  key={item}
                  className="border-b border-border pb-3 font-medium"
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {itens.map((item) => (
              <tr key={item.id} className="border-b border-border">
                <td className="py-3">{item.data}</td>
                <td>{item.descricao}</td>
                <td>
                  <BadgeStatus
                    negativo={item.categoria === "Despesa"}
                    alerta={item.categoria === "Comissão"}
                  >
                    {item.categoria}
                  </BadgeStatus>
                </td>
                <td>{item.forma}</td>
                <td className="font-semibold">{moeda.format(item.valor)}</td>
                <td>
                  <BadgeStatus>{item.status}</BadgeStatus>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Cartao>
  );
}

export function TabelaComissoes({ itens }: { itens: ComissaoBarbeiro[] }) {
  return (
    <Cartao titulo="Comissões dos barbeiros">
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>
            <th className="border-b border-border pb-3 font-medium">
              Barbeiro
            </th>
            <th className="border-b border-border pb-3 font-medium">
              Valor no mês
            </th>
            <th className="border-b border-border pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item) => (
            <tr key={item.id} className="border-b border-border">
              <td className="py-3 font-semibold">{item.barbeiro}</td>
              <td>{moeda.format(item.valor)}</td>
              <td>
                <BadgeStatus alerta={!item.pago}>
                  {item.pago ? "Pago" : "Pendente"}
                </BadgeStatus>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Cartao>
  );
}

export function ControlesFinanceiros() {
  return (
    <div className="mb-5 flex flex-wrap justify-end gap-3">
      <BotaoIndisponivel>01/09/2026 — 30/09/2026</BotaoIndisponivel>
      <BotaoIndisponivel>Exportar relatório</BotaoIndisponivel>
      <BotaoIndisponivel destaque>+ Registrar movimentação</BotaoIndisponivel>
    </div>
  );
}
