import { Cartao } from "../../../components/dashboard-compartilhado";
import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type { consultarBarbeiros } from "../services/barbeiros-api";
type Resposta = Awaited<ReturnType<typeof consultarBarbeiros>>;

export function IndicadoresBarbeiros({
  dados,
}: {
  dados: Resposta["indicadores"];
}) {
  return (
    <div className="my-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples
        titulo="Barbeiros ativos"
        valor={String(dados.ativos)}
        icone="usuarios"
      />
      <IndicadorSimples
        titulo="Atendimentos concluídos no mês"
        valor={String(dados.atendimentosMes)}
        icone="agenda"
      />
      <IndicadorSimples
        titulo="Comissões a pagar"
        valor={moeda.format(dados.comissoesAPagar)}
        icone="financeiro"
      />
    </div>
  );
}

export function CartoesBarbeiros({
  barbeiros,
}: {
  barbeiros: Resposta["data"];
}) {
  if (!barbeiros.length)
    return <p className="py-8 text-center">Nenhum barbeiro encontrado.</p>;
  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
      {barbeiros.map((b) => (
        <Cartao key={b.id}>
          <header className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-semibold"
            >
              {b.nome
                .split(" ")
                .filter(Boolean)
                .slice(0, 2)
                .map((n) => n[0])
                .join("")}
            </span>
            <h2 className="font-semibold">{b.nome}</h2>
            <BadgeStatus alerta={b.status !== "ATIVO"}>
              {b.status === "ATIVO"
                ? "Ativo"
                : b.status === "INATIVO"
                  ? "Inativo"
                  : "Afastado"}
            </BadgeStatus>
          </header>
          <dl className="mt-4 divide-y divide-border text-sm">
            {[
              ["Filial", b.filial],
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
              <div key={rotulo} className="py-3">
                <dt className="text-muted">{rotulo}</dt>
                <dd className="font-semibold">{valor}</dd>
              </div>
            ))}
          </dl>
        </Cartao>
      ))}
    </div>
  );
}
