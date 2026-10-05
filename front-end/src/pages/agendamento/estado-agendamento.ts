export interface RascunhoAgendamento {
  idFilial?: number;
  idBarbeiro?: number;
  servicoIds: number[];
  data: string;
  inicio: string;
  observacao: string;
  etapa: string;
}
export const rascunhoInicial: RascunhoAgendamento = {
  servicoIds: [],
  data: "",
  inicio: "",
  observacao: "",
  etapa: "Filial",
};
export type AcaoRascunho =
  | { tipo: "filial"; id?: number; servicoIdsValidos?: number[] }
  | { tipo: "barbeiro"; id: number }
  | { tipo: "servicos"; ids: number[] }
  | { tipo: "atualizar"; dados: Partial<RascunhoAgendamento> }
  | { tipo: "limpar" };
export function reduzirRascunho(
  estado: RascunhoAgendamento,
  acao: AcaoRascunho,
): RascunhoAgendamento {
  switch (acao.tipo) {
    case "filial":
      return acao.id === estado.idFilial
        ? estado
        : {
            ...rascunhoInicial,
            idFilial: acao.id,
            servicoIds: acao.servicoIdsValidos ?? [],
          };
    case "barbeiro":
      return acao.id === estado.idBarbeiro
        ? estado
        : { ...estado, idBarbeiro: acao.id, data: "", inicio: "" };
    case "servicos":
      return { ...estado, servicoIds: acao.ids, inicio: "" };
    case "atualizar":
      return { ...estado, ...acao.dados };
    case "limpar":
      return { ...rascunhoInicial };
  }
}
