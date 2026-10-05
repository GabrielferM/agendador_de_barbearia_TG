import type { AgendamentoRespostaDto } from "../../../api/models";
import { moeda, endereco, dataHorario } from "../formatadores";
export function ResumoAgendamento({ item }: { item: AgendamentoRespostaDto }) {
  return (
    <dl className="grid gap-4 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-muted">Local</dt>
        <dd className="font-semibold">{item.filial.nome}</dd>
        <dd>{endereco(item.filial)}</dd>
      </div>
      <div>
        <dt className="text-muted">Profissional</dt>
        <dd>{item.barbeiro.nomeProfissional}</dd>
      </div>
      <div>
        <dt className="text-muted">Data e horário de Brasília</dt>
        <dd>{dataHorario(item.inicioPrevisto)}</dd>
      </div>
      <div>
        <dt className="text-muted">Serviços</dt>
        <dd>
          {item.servicos
            .map(
              (s) =>
                `${s.servico.nome}${s.quantidade > 1 ? ` (${s.quantidade}×)` : ""}`,
            )
            .join(", ")}
        </dd>
      </div>
      <div>
        <dt className="text-muted">Duração</dt>
        <dd>
          {item.servicos.reduce(
            (s, i) => s + i.duracaoAplicadaMinutos * i.quantidade,
            0,
          )}{" "}
          min
        </dd>
      </div>
      <div>
        <dt className="text-muted">Valor total</dt>
        <dd className="font-semibold text-primary">
          {moeda(
            item.servicos.reduce(
              (s, i) => s + Math.round(Number(i.subtotal) * 100),
              0,
            ) / 100,
          )}
        </dd>
      </div>
      {item.observacaoCliente && (
        <div>
          <dt className="text-muted">Sua observação</dt>
          <dd className="whitespace-pre-wrap">{item.observacaoCliente}</dd>
        </div>
      )}
    </dl>
  );
}
