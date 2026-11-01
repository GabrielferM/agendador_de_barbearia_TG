import { FaixaIndicadores } from "../../components/painel-catalogo";
import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
} from "../../components/componentes-administrativos";
import type { consultarBarbeiros } from "../services/barbeiros-api";
type Resposta = Awaited<ReturnType<typeof consultarBarbeiros>>;

export function IndicadoresBarbeiros({
  dados,
}: {
  dados: Resposta["indicadores"];
}) {
  return <FaixaIndicadores itens={[
    { titulo: 'Barbeiros ativos', valor: String(dados.ativos) },
    { titulo: 'Atendimentos concluídos no mês', valor: String(dados.atendimentosMes) },
    { titulo: 'Comissões a pagar', valor: moeda.format(dados.comissoesAPagar), detalhe: 'Todos os períodos' },
  ]} />;
}

export function CartoesBarbeiros({
  barbeiros,
}: {
  barbeiros: Resposta["data"];
}) {
  if (!barbeiros.length)
    return <p className="py-8 text-center">Nenhum barbeiro encontrado.</p>;
  return (
    <div className="grid gap-3 xl:grid-cols-2">
      {barbeiros.map((b) => (
        <article key={b.id} className="min-w-0 rounded-xl border border-border p-4">
          <header className="flex flex-wrap items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary font-semibold"
            >
              {b.nome
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </span>
            <div className="min-w-0 flex-1 break-words"><h2 className="break-words font-semibold tabular-nums">{b.nome}</h2><p className="text-sm">{b.filial || "—"}</p></div>
            <BadgeStatus alerta={b.status !== "ATIVO"}>
              {b.status === "ATIVO"
                ? "Ativo"
                : b.status === "INATIVO"
                  ? "Inativo"
                  : "Afastado"}
            </BadgeStatus>
          </header>
          <dl className="mt-4 grid gap-x-4 gap-y-3 border-t border-border pt-3 text-sm sm:grid-cols-2">
            {[
              [
                "Agendamentos hoje (exceto cancelados)",
                String(b.atendimentosHoje),
              ],
              [
                "Receita de serviços concluídos no mês",
                moeda.format(b.receitaMes),
              ],
              [
                "Comissões registradas no mês",
                moeda.format(b.comissoesRegistradasMes),
              ],
              [
                "Comissões a pagar geradas no mês",
                moeda.format(b.comissoesAPagar),
              ],
            ].map(([rotulo, valor]) => (
              <div key={rotulo} className="min-w-0">
                <dt className="text-foreground">{rotulo}</dt>
                <dd className="break-words font-semibold tabular-nums">{valor}</dd>
              </div>
            ))}
          </dl>
        </article>
      ))}
    </div>
  );
}
