import { Button } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { agendamentoControllerListarHistorico } from "../../../../../api/agendamentos/agendamentos";
import { useAutenticacao } from "../../../../../auth/contexto-autenticacao";
import { EstadoConsulta } from "../../../../agendamento/components/etapas-agendamento";
import { dataHorario } from "../../../../agendamento/formatadores";
import { nomeStatus } from "../../../components/dashboard-formatadores";
import { executarHttp } from "../../../../../api/operacao-http";
interface Evento {
  id: number;
  statusAnterior: string | null;
  statusNovo: string;
  dataAlteracao: string;
  usuarioResponsavel?: { nome: string };
}
interface Historico {
  data: Evento[];
  meta: { totalPaginas: number; total: number };
}
async function buscar(
  id: number,
  pagina: number,
  signal?: AbortSignal,
): Promise<Historico> {
  const valor = (await executarHttp(() =>
    agendamentoControllerListarHistorico(
      id,
      { pagina, limite: 10 },
      { signal },
    ),
  )) as Historico;
  if (
    !valor ||
    !Array.isArray(valor.data) ||
    !Number.isInteger(valor.meta?.totalPaginas) ||
    !valor.data.every(
      (item) =>
        Number.isInteger(item.id) &&
        typeof item.statusNovo === "string" &&
        Number.isFinite(Date.parse(item.dataAlteracao)) &&
        (item.usuarioResponsavel === undefined ||
          typeof item.usuarioResponsavel.nome === "string"),
    )
  )
    throw new Error("Histórico inválido.");
  return valor;
}
export function HistoricoAtendimento({ id }: { id: number }) {
  const { usuario } = useAutenticacao();
  const [pagina, definirPagina] = useState(1);
  const consulta = useQuery({
    queryKey: ["historico-status", usuario?.id, id, pagina],
    queryFn: ({ signal }) => buscar(id, pagina, signal),
    retry: false,
  });
  return (
    <section className="mt-5 rounded-2xl border border-border bg-surface p-5">
      <h2 className="mb-3 font-semibold">Histórico de status</h2>
      {consulta.isSuccess && !consulta.data.data.length ? (
        <p className="text-muted">
          Histórico não registrado para este agendamento. Transições anteriores
          não foram reconstruídas.
        </p>
      ) : (
        <EstadoConsulta
          carregando={consulta.isPending}
          erro={consulta.error}
          vazio={false}
          tentar={() => void consulta.refetch()}
        >
          <ol className="divide-y divide-border">
            {consulta.data?.data.map((evento) => (
              <li key={evento.id} className="py-3">
                <p>
                  {evento.statusAnterior
                    ? nomeStatus(evento.statusAnterior)
                    : "Sem estado anterior"}{" "}
                  → {nomeStatus(evento.statusNovo)}
                </p>
                <p className="text-sm text-muted">
                  {dataHorario(evento.dataAlteracao)}
                  {evento.usuarioResponsavel &&
                    ` · ${evento.usuarioResponsavel.nome}`}
                </p>
              </li>
            ))}
          </ol>
        </EstadoConsulta>
      )}
      {consulta.data && consulta.data.meta.totalPaginas > 1 && (
        <nav
          aria-label="Paginação do histórico"
          className="mt-4 flex justify-between"
        >
          <Button
            variant="secondary"
            isDisabled={pagina === 1}
            onPress={() => definirPagina((p) => p - 1)}
          >
            Anterior
          </Button>
          <span>
            {pagina} de {consulta.data.meta.totalPaginas}
          </span>
          <Button
            variant="secondary"
            isDisabled={pagina >= consulta.data.meta.totalPaginas}
            onPress={() => definirPagina((p) => p + 1)}
          >
            Próxima
          </Button>
        </nav>
      )}
    </section>
  );
}
