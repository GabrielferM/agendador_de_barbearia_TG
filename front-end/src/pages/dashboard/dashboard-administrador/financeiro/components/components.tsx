import { Barras, Cartao } from "../../../components/dashboard-compartilhado";
import { moeda, nomeStatus } from "../../../components/dashboard-formatadores";
import { IndicadorSimples } from "../../components/componentes-administrativos";
import type { consultarFinanceiro } from "../services/financeiro-api";
type Resposta = Awaited<ReturnType<typeof consultarFinanceiro>>;
const formatarData = (valor: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
  }).format(new Date(valor));

export function IndicadoresFinanceiros({
  dados,
}: {
  dados: Resposta["indicadores"];
}) {
  return (
    <div className="my-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples
        titulo="Receita de serviços concluídos"
        valor={moeda.format(dados.receita)}
        detalhe={`${dados.variacaoReceitaPercentual}% em relação ao período anterior equivalente`}
        icone="financeiro"
      />
      <IndicadorSimples titulo="Comissões a pagar" valor={moeda.format(dados.comissoesAPagar)} detalhe="Previstas + liberadas, geradas no período" icone="financeiro" />
      <IndicadorSimples
        titulo="Comissões registradas no período"
        valor={moeda.format(dados.comissoes)}
        detalhe="Inclui todos os status, detalhados abaixo"
        icone="usuarios"
      />
    </div>
  );
}
export function FluxoFinanceiro({
  semanas,
}: {
  semanas: Resposta["fluxoSemanal"];
}) {
  return (
    <Cartao titulo="Receita por intervalos de sete dias">
      <Barras
        pontos={semanas.map((s) => ({ data: s.inicio, valor: s.receita }))}
        moedaValores
      />
    </Cartao>
  );
}
export function TabelaMovimentacoes({
  itens,
}: {
  itens: Resposta["movimentacoesRecentes"];
}) {
  return (
    <Cartao titulo="Últimos dez atendimentos concluídos">
      {!itens.length ? (
        <p>Nenhum atendimento concluído no período.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr>
                {["Data", "Descrição", "Valor", "Status"].map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="pb-3 font-medium text-muted"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="py-3">{formatarData(i.data)}</td>
                  <td>{i.descricao}</td>
                  <td>{moeda.format(i.valor)}</td>
                  <td>{nomeStatus(i.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Cartao>
  );
}
export function TabelaComissoes({
  itens,
}: {
  itens: Resposta["comissoesPorBarbeiro"];
}) {
  return (
    <Cartao titulo="Comissões por barbeiro e status">
      {!itens.length ? (
        <p>Nenhuma comissão registrada no período.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left text-sm">
            <thead>
              <tr>
                {[
                  "Barbeiro",
                  "Total registrado",
                  "Prevista",
                  "Liberada",
                  "Paga",
                  "Cancelada",
                  "Estornada",
                ].map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="pb-3 font-medium text-muted"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {itens.map((i) => (
                <tr key={i.id} className="border-t border-border">
                  <td className="py-3 font-semibold">{i.barbeiro}</td>
                  <td>{moeda.format(i.total)}</td>
                  {Object.values(i.porStatus).map((valor, indice) => (
                    <td key={indice}>{moeda.format(valor)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Cartao>
  );
}
