import { moeda } from "../../../components/dashboard-formatadores";
import {
  BadgeStatus,
  BotaoIndisponivel,
  CampoVisual,
  IndicadorSimples,
} from "../../components/componentes-administrativos";
import type { ServicoAdministrativo } from "../types";

export function IndicadoresServicos() {
  return (
    <div className="mb-5 grid gap-4 md:grid-cols-3">
      <IndicadorSimples titulo="Serviços ativos" valor="8" icone="servicos" />
      <IndicadorSimples titulo="Mais realizado" valor="Corte de cabelo" />
      <IndicadorSimples
        titulo="Ticket médio"
        valor={moeda.format(48)}
        icone="financeiro"
      />
    </div>
  );
}

export function CatalogoServicos({
  servicos,
}: {
  servicos: ServicoAdministrativo[];
}) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
      <h2 className="font-serif text-xl font-bold">Catálogo de serviços</h2>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-muted">
            <tr>
              {[
                "Serviço",
                "Categoria",
                "Duração",
                "Preço",
                "Comissão",
                "Status",
                "Ações",
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
            {servicos.map((servico) => (
              <tr key={servico.id} className="border-b border-border">
                <td className="py-5 font-semibold">{servico.nome}</td>
                <td>{servico.categoria}</td>
                <td>{servico.duracaoMinutos} min</td>
                <td>{moeda.format(servico.preco)}</td>
                <td>{servico.comissao}%</td>
                <td>
                  <BadgeStatus>● Ativo</BadgeStatus>
                </td>
                <td>
                  <button
                    disabled
                    title="Disponível na integração real"
                    className="cursor-not-allowed text-primary opacity-60"
                  >
                    Editar · Mais
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function ControlesServicos() {
  return (
    <div className="mb-5 flex flex-col gap-3 md:flex-row">
      <CampoVisual placeholder="Buscar serviço" />
      <div className="md:w-80">
        <CampoVisual placeholder="Todas as categorias" />
      </div>
      <BotaoIndisponivel destaque>+ Novo serviço</BotaoIndisponivel>
    </div>
  );
}
