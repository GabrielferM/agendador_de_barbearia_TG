import type { AgendamentoRespostaDto } from "../../../api/models";
import { moeda, endereco, dataHorario } from "../formatadores";

export function ResumoAgendamento({
  item,
  detalhes = true,
}: {
  item: AgendamentoRespostaDto;
  detalhes?: boolean;
}) {
  return (
    <div className="min-w-0 break-words [overflow-wrap:anywhere]">
      <div className="grid items-start gap-4 lg:grid-cols-[minmax(13rem,0.8fr)_minmax(0,2fr)]">
        <div className="rounded-xl bg-background px-4 py-3">
          <p className="text-xs font-medium text-primary">
            Data e horário de Brasília
          </p>
          <p className="mt-1 font-semibold text-primary">
            <time dateTime={item.inicioPrevisto}>
              {dataHorario(item.inicioPrevisto)}
            </time>
          </p>
        </div>
        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-[minmax(0,1fr)_auto]">
          <div>
            <dt className="sr-only">Serviços</dt>
            <dd className="font-semibold text-foreground">
              {item.servicos
                .map(
                  (s) =>
                    `${s.servico.nome}${s.quantidade > 1 ? ` (${s.quantidade}×)` : ""}`,
                )
                .join(", ")}
            </dd>
          </div>
          <div>
            <dt className="sr-only">Profissional e filial</dt>
            <dd className="flex flex-wrap gap-x-5 gap-y-2 text-foreground/80">
              <span>Com {item.barbeiro.nomeProfissional}</span>
              <span>{item.filial.nome}</span>
            </dd>
          </div>
          <div className="sm:col-start-2 sm:row-start-1 sm:row-span-2 sm:text-right">
            <dt className="text-xs text-foreground/75">Valor total</dt>
            <dd className="text-lg font-semibold text-primary">
              {moeda(
                item.servicos.reduce(
                  (s, i) => s + Math.round(Number(i.subtotal) * 100),
                  0,
                ) / 100,
              )}
            </dd>
            <dd className="mt-1 text-xs text-foreground/75">
              {item.servicos.reduce(
                (s, i) => s + i.duracaoAplicadaMinutos * i.quantidade,
                0,
              )}{" "}
              min de atendimento
            </dd>
          </div>
        </dl>
      </div>
      {detalhes && <DetalhesAgendamento item={item} />}
    </div>
  );
}

export function DetalhesAgendamento({
  item,
}: {
  item: AgendamentoRespostaDto;
}) {
  return (
    <dl className="mt-4 space-y-3 border-t border-border pt-4 text-sm break-words [overflow-wrap:anywhere]">
      <div>
        <dt className="font-medium">Endereço</dt>
        <dd className="mt-1 text-foreground/80">{endereco(item.filial)}</dd>
      </div>
      {item.observacaoCliente?.trim() && (
        <div>
          <dt className="font-medium">Sua observação</dt>
          <dd className="mt-1 whitespace-pre-wrap text-foreground/80">
            {item.observacaoCliente}
          </dd>
        </div>
      )}
      {item.motivoCancelamento?.trim() && (
        <div>
          <dt className="font-medium">Motivo do cancelamento</dt>
          <dd className="mt-1 whitespace-pre-wrap text-foreground/80">
            {item.motivoCancelamento}
          </dd>
        </div>
      )}
    </dl>
  );
}
