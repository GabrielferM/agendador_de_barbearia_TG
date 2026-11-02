import { FaixaIndicadores } from "../../components/painel-catalogo";
import { moeda } from "../../../components/dashboard-formatadores";
import { BadgeStatus } from "../../components/componentes-administrativos";
import type { consultarServicos } from "../services/servicos-api";
type Resposta = Awaited<ReturnType<typeof consultarServicos>>;

export function IndicadoresServicos({
  dados,
}: {
  dados: Resposta["indicadores"];
}) {
  return (
    <FaixaIndicadores
      itens={[
        { titulo: "Serviços ativos", valor: String(dados.ativos) },
        {
          titulo: "Mais realizado no mês",
          valor: dados.maisRealizado ?? "Sem atendimentos",
        },
        {
          titulo: "Ticket médio por atendimento no mês",
          valor: moeda.format(dados.ticketMedio),
          detalhe: "Por atendimento concluído",
        },
      ]}
    />
  );
}

export function CatalogoServicos({
  servicos,
  pendente,
  idPendente,
  alterar,
}: {
  servicos: Resposta["data"];
  pendente: boolean;
  idPendente?: number;
  alterar: (id: number, ativo: boolean) => void;
}) {
  return (
    <div>
      {!servicos.length ? (
        <p className="py-8 text-center">Nenhum serviço encontrado.</p>
      ) : (
        <div
          className="overflow-x-auto"
          role="region"
          aria-label="Catálogo de serviços"
          tabIndex={0}
        >
          <table className="w-full min-w-[650px] text-left text-sm">
            <caption>Catálogo de serviços</caption>
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
                    className={
                      ["Preço", "Realizados no mês", "Receita no mês"].includes(
                        c,
                      )
                        ? "numero"
                        : "text-left"
                    }
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
                  <td className="numero">{moeda.format(s.preco)}</td>
                  <td className="numero">{s.realizadosMes}</td>
                  <td className="numero">{moeda.format(s.receitaMes)}</td>
                  <td>
                    <BadgeStatus alerta={!s.ativo}>
                      {s.ativo ? "Ativo" : "Inativo"}
                    </BadgeStatus>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="min-h-9 rounded-lg border border-primary px-3 text-primary hover:bg-primary/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-50"
                      aria-label={`${s.ativo ? "Desativar" : "Ativar"} ${s.nome}`}
                      disabled={pendente}
                      onClick={() => alterar(s.id, !s.ativo)}
                    >
                      {idPendente === s.id
                        ? "Salvando…"
                        : s.ativo
                          ? "Desativar"
                          : "Ativar"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
