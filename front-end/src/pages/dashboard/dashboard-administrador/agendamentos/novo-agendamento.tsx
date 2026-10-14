import { Button } from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import type { ItemAgendamentoDto } from "../../../../api/models";
import {
  buscarBarbeiros,
  buscarServicos,
  ErroAgendamento,
  mensagemErro,
} from "../../../agendamento/services/agendamento-api";
import { EstadoConsulta } from "../../../agendamento/components/etapas-agendamento";
import { moeda, dataHorario } from "../../../agendamento/formatadores";
import { DialogoOperacao } from "../components/dialogo-operacao";
import { todasFiliais, seletoresPessoas } from "../services/cadastros-api";
import { texto } from "../services/operacoes-api";
import { criarAdmin, horariosAdmin } from "./services/agenda-admin-api";
const campo =
  "mt-1 block w-full rounded-lg border border-border bg-surface p-2";
export function NovoAgendamentoAdmin({ fechar }: { fechar: () => void }) {
  const { usuario } = useAutenticacao();
  const cache = useQueryClient();
  const [etapa, definirEtapa] = useState(0);
  const [idFilial, filial] = useState(0);
  const [idBarbeiro, barbeiro] = useState(0);
  const [idCliente, cliente] = useState(0);
  const [itens, definirItens] = useState<ItemAgendamentoDto[]>([]);
  const [data, definirData] = useState("");
  const [inicio, definirInicio] = useState("");
  const [consultar, definirConsultar] = useState(false);
  const [observacaoCliente, observacao] = useState("");
  const [observacaoInterna, interna] = useState("");
  const filiais = useQuery({
    queryKey: ["admin-filiais", usuario?.id, "seletor"],
    queryFn: ({ signal }) => todasFiliais(signal),
    retry: false,
  });
  const barbeiros = useQuery({
    queryKey: ["agendar", "barbeiros", idFilial],
    queryFn: ({ signal }) => buscarBarbeiros(idFilial, signal),
    enabled: idFilial > 0,
    retry: false,
  });
  const clientes = useQuery({
    queryKey: ["admin-clientes", usuario?.id, "seletor"],
    queryFn: ({ signal }) => seletoresPessoas("clientes", signal),
    retry: false,
  });
  const servicos = useQuery({
    queryKey: ["agendar", "servicos"],
    queryFn: ({ signal }) => buscarServicos(signal),
    retry: false,
  });
  const horarios = useQuery({
    queryKey: [
      "agendar",
      "horarios",
      "admin",
      usuario?.id,
      idFilial,
      idBarbeiro,
      idCliente,
      data,
      itens,
    ],
    queryFn: ({ signal }) =>
      horariosAdmin(
        {
          idFilial,
          idBarbeiro,
          idCliente,
          data,
          servicos: JSON.stringify(itens),
        },
        signal,
      ),
    enabled: etapa === 2 && consultar && !!data && itens.length > 0,
    retry: false,
  });
  const mutacao = useMutation({
    mutationFn: () =>
      criarAdmin({
        idFilial,
        idBarbeiro,
        idCliente,
        inicio,
        servicos: itens,
        observacaoCliente,
        observacaoInterna,
      }),
    retry: false,
    onSuccess: async () => {
      await Promise.all(
        [
          "agenda-admin",
          "admin-clientes",
          "admin-barbeiros",
          "dashboard",
          "agendar",
        ].map((key) => cache.invalidateQueries({ queryKey: [key] })),
      );
      fechar();
    },
    onError: (erro) => {
      if (erro instanceof ErroAgendamento && erro.status === 409) {
        definirInicio("");
        void horarios.refetch();
      }
    },
  });
  function limparHorario() {
    definirInicio("");
    definirConsultar(false);
  }
  function mudarItem(
    idServico: number,
    chave: "quantidade" | "desconto",
    valor: number,
  ) {
    definirItens((atuais) =>
      atuais.map((item) =>
        item.idServico === idServico ? { ...item, [chave]: valor } : item,
      ),
    );
    limparHorario();
  }
  const carregando = [filiais, clientes, servicos].some((q) => q.isPending);
  const erro = filiais.error || clientes.error || servicos.error;
  return (
    <DialogoOperacao
      titulo="Novo agendamento"
      aberto
      fechar={fechar}
      pendente={mutacao.isPending}
      sujo={idFilial > 0 || idCliente > 0 || itens.length > 0}
    >
      <p className="mb-4 text-sm text-muted">
        Etapa {etapa + 1} de 3 · filial → profissional/cliente → serviços e
        horário
      </p>
      <EstadoConsulta
        carregando={carregando}
        erro={erro}
        vazio={false}
        tentar={() => {
          void filiais.refetch();
          void clientes.refetch();
          void servicos.refetch();
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (mutacao.isPending) return;
            if (etapa < 2) {
              if (etapa === 0 && !idFilial) return;
              if (etapa === 1 && (!idBarbeiro || !idCliente)) return;
              definirEtapa((p) => p + 1);
              return;
            }
            if (
              inicio &&
              window.confirm(
                `Confirmar atendimento em ${dataHorario(inicio)}? Total ${moeda(Number(horarios.data?.valorTotal))}.`,
              )
            )
              mutacao.mutate();
          }}
        >
          {etapa === 0 && (
            <label>
              Filial
              <select
                required
                value={idFilial || ""}
                disabled={mutacao.isPending}
                onChange={(e) => {
                  filial(Number(e.target.value));
                  barbeiro(0);
                  limparHorario();
                }}
                className={campo}
              >
                <option value="">Selecione</option>
                {filiais.data
                  ?.filter((f) => f.status === "ATIVA")
                  .map((f) => (
                    <option key={Number(f.id)} value={String(f.id)}>
                      {texto(f.nome)}
                    </option>
                  ))}
              </select>
            </label>
          )}
          {etapa === 1 && (
            <div className="space-y-4">
              <label>
                Barbeiro
                <select
                  required
                  value={idBarbeiro || ""}
                  onChange={(e) => {
                    barbeiro(Number(e.target.value));
                    limparHorario();
                  }}
                  className={campo}
                >
                  <option value="">
                    {barbeiros.isPending ? "Carregando…" : "Selecione"}
                  </option>
                  {barbeiros.data?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.nomeProfissional}
                    </option>
                  ))}
                </select>
              </label>
              {barbeiros.isError && (
                <p role="alert">
                  {mensagemErro(barbeiros.error)}{" "}
                  <Button
                    variant="secondary"
                    onPress={() => void barbeiros.refetch()}
                  >
                    Atualizar barbeiros
                  </Button>
                </p>
              )}
              <label>
                Cliente
                <select
                  required
                  value={idCliente || ""}
                  onChange={(e) => {
                    cliente(Number(e.target.value));
                    limparHorario();
                  }}
                  className={campo}
                >
                  <option value="">Selecione</option>
                  {clientes.data
                    ?.filter((c) => c.status === "ATIVO")
                    .map((c) => (
                      <option key={Number(c.id)} value={String(c.id)}>
                        {texto(c.nome)}
                      </option>
                    ))}
                </select>
              </label>
            </div>
          )}
          {etapa === 2 && (
            <div className="space-y-4">
              <fieldset>
                <legend className="font-semibold">
                  Serviços e quantidades
                </legend>
                {servicos.data?.map((s) => {
                  const item = itens.find((i) => i.idServico === s.id);
                  return (
                    <div
                      key={s.id}
                      className="my-3 rounded-lg border border-border p-3"
                    >
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={!!item}
                          disabled={mutacao.isPending}
                          onChange={(e) => {
                            definirItens((atuais) =>
                              e.target.checked
                                ? [
                                    ...atuais,
                                    {
                                      idServico: s.id,
                                      quantidade: 1,
                                      desconto: 0,
                                    },
                                  ]
                                : atuais.filter((i) => i.idServico !== s.id),
                            );
                            limparHorario();
                          }}
                        />
                        {s.nome} · {moeda(Number(s.precoBase))} ·{" "}
                        {s.duracaoMinutos} min
                      </label>
                      {item && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          <label>
                            Quantidade
                            <input
                              type="number"
                              required
                              min={1}
                              step="1"
                              value={item.quantidade ?? 1}
                              disabled={mutacao.isPending}
                              onChange={(e) =>
                                mudarItem(
                                  s.id,
                                  "quantidade",
                                  Number(e.target.value),
                                )
                              }
                              className={campo}
                            />
                          </label>
                          <label>
                            Desconto total do item (R$)
                            <input
                              type="number"
                              required
                              min={0}
                              max={Number(s.precoBase) * (item.quantidade ?? 1)}
                              step="0.01"
                              value={item.desconto ?? 0}
                              disabled={mutacao.isPending}
                              onChange={(e) =>
                                mudarItem(
                                  s.id,
                                  "desconto",
                                  Number(e.target.value),
                                )
                              }
                              className={campo}
                            />
                          </label>
                        </div>
                      )}
                    </div>
                  );
                })}
              </fieldset>
              <label>
                Data
                <input
                  type="date"
                  required
                  value={data}
                  disabled={mutacao.isPending}
                  onChange={(e) => {
                    definirData(e.target.value);
                    limparHorario();
                  }}
                  className={campo}
                />
              </label>
              <Button
                variant="secondary"
                isDisabled={
                  !data ||
                  !itens.length ||
                  itens.some(
                    (i) =>
                      !Number.isInteger(i.quantidade) ||
                      Number(i.quantidade) < 1 ||
                      Number(i.desconto) < 0,
                  ) ||
                  mutacao.isPending
                }
                onPress={() => {
                  definirConsultar(true);
                  if (consultar) void horarios.refetch();
                }}
              >
                Consultar horários
              </Button>
              {consultar && (
                <EstadoConsulta
                  carregando={horarios.isPending}
                  erro={horarios.error}
                  vazio={!horarios.data?.horarios.length}
                  tentar={() => void horarios.refetch()}
                >
                  <label>
                    Horário
                    <select
                      required
                      value={inicio}
                      disabled={mutacao.isPending}
                      onChange={(e) => definirInicio(e.target.value)}
                      className={campo}
                    >
                      <option value="">Selecione</option>
                      {horarios.data?.horarios.map((h) => (
                        <option key={h.inicio} value={h.inicio}>
                          {dataHorario(h.inicio)}
                        </option>
                      ))}
                    </select>
                  </label>
                </EstadoConsulta>
              )}
              {horarios.data && consultar && (
                <p role="status">
                  Resumo:{" "}
                  {filiais.data?.find((f) => f.id === idFilial)?.nome as string}{" "}
                  ·{" "}
                  {
                    barbeiros.data?.find((b) => b.id === idBarbeiro)
                      ?.nomeProfissional
                  }{" "}
                  ·{" "}
                  {texto(clientes.data?.find((c) => c.id === idCliente)?.nome)}{" "}
                  · {horarios.data.duracaoTotalMinutos} min · Total{" "}
                  {moeda(Number(horarios.data.valorTotal))}
                </p>
              )}
              <label>
                Observação do cliente
                <textarea
                  value={observacaoCliente}
                  disabled={mutacao.isPending}
                  onChange={(e) => observacao(e.target.value)}
                  className={campo}
                />
              </label>
              <label>
                Observação interna
                <textarea
                  value={observacaoInterna}
                  disabled={mutacao.isPending}
                  onChange={(e) => interna(e.target.value)}
                  className={campo}
                />
              </label>
            </div>
          )}
          {mutacao.isError && (
            <p role="alert" className="my-3 text-danger">
              {mensagemErro(mutacao.error)}
            </p>
          )}
          <div className="mt-5 flex justify-between gap-3">
            <Button
              variant="secondary"
              isDisabled={etapa === 0 || mutacao.isPending}
              onPress={() => definirEtapa((p) => p - 1)}
            >
              Voltar etapa
            </Button>
            <Button
              type="submit"
              isDisabled={
                mutacao.isPending || (etapa === 2 && (!inicio || !itens.length))
              }
            >
              {mutacao.isPending
                ? "Criando…"
                : etapa === 2
                  ? "Confirmar agendamento"
                  : "Avançar"}
            </Button>
          </div>
        </form>
      </EstadoConsulta>
    </DialogoOperacao>
  );
}
