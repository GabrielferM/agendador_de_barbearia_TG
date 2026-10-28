import type { ReactNode } from "react";
import { Cartao } from "../../../components/dashboard-compartilhado";
import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type { consultarServicos } from "../services/servicos-api";
type Resposta = Awaited<ReturnType<typeof consultarServicos>>;

export function IndicadoresServicos({
  dados,
}: {
  dados: Resposta["indicadores"];
}) {
  return (
    <div className="my-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples
        titulo="Serviços ativos"
        valor={String(dados.ativos)}
        icone="servicos"
      />
      <IndicadorSimples
        titulo="Mais realizado no mês"
        valor={dados.maisRealizado ?? "Sem atendimentos"}
      />
      <IndicadorSimples
        titulo="Ticket médio por atendimento no mês"
        valor={moeda.format(dados.ticketMedio)}
        icone="financeiro"
      />
    </div>
  );
}

export function CatalogoServicos({ servicos, acoes }: { servicos: Resposta["data"]; acoes?: (servico: Resposta["data"][number]) => ReactNode }) {
  return (
    <Cartao titulo="Catálogo de serviços">
      {!servicos.length ? (
        <p className="py-8 text-center">Nenhum serviço encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">
            <thead>
              <tr>
                {[
                  "Serviço",
                  "Duração",
                  "Preço",
                  "Realizados no mês",
                  "Receita no mês",
                  "Status",
                  "Ações",
                ].map((c) => (
                  <th
                    key={c}
                    className="pb-3 font-medium text-muted"
                    scope="col"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {servicos.map((s) => (
                <tr key={s.id} className="border-t border-border">
                  <td className="py-4 font-semibold">{s.nome}</td>
                  <td>{s.duracaoMinutos} min</td>
                  <td className="text-right">{moeda.format(s.preco)}</td>
                  <td>{s.realizadosMes}</td>
                  <td className="text-right">{moeda.format(s.receitaMes)}</td>
                  <td>
                    <BadgeStatus alerta={!s.ativo}>
                      {s.ativo ? "Ativo" : "Inativo"}
                    </BadgeStatus>
                  </td>
                  <td>{acoes?.(s)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Cartao>
  );
}
