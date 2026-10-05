import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";
import { useRascunhoAgendamento } from "../rascunho-agendamento";
import {
  buscarBarbeiros,
  buscarFiliais,
  buscarHorarios,
  buscarServicos,
  criarAgendamento,
  ErroAgendamento,
} from "../services/agendamento-api";

export function useAgendamento() {
  const { rascunho, alterar } = useRascunhoAgendamento();
  const { usuario, carregando } = useAutenticacao();
  const queryClient = useQueryClient();
  const [aviso, definirAviso] = useState("");
  const filiais = useQuery({
    queryKey: ["agendar", "filiais"],
    queryFn: ({ signal }) => buscarFiliais(signal),
    staleTime: 0,
  });
  const servicos = useQuery({
    queryKey: ["agendar", "servicos"],
    queryFn: ({ signal }) => buscarServicos(signal),
    staleTime: 0,
  });
  const filialUnica = filiais.data?.length === 1 ? filiais.data[0] : undefined;
  const filialSelecionada = filiais.data?.find(
    (item) => item.id === rascunho.idFilial,
  );
  const idFilial = filialSelecionada?.id ?? filialUnica?.id;
  const filial = filiais.data?.find((item) => item.id === idFilial);
  const servicoIdsValidos = () =>
    rascunho.servicoIds.filter((id) =>
      servicos.data?.some((item) => item.id === id),
    );
  function selecionarFilial(id: number) {
    alterar({ tipo: "filial", id, servicoIdsValidos: servicoIdsValidos() });
  }
  useEffect(() => {
    if (!filiais.data || servicos.isPending) return;
    if (rascunho.idFilial !== undefined && filialSelecionada) return;
    if (rascunho.idFilial === filialUnica?.id) return;
    if (rascunho.idFilial === undefined && !filialUnica) return;
    alterar({
      tipo: "filial",
      id: filialUnica?.id,
      servicoIdsValidos: rascunho.servicoIds.filter((id) =>
        servicos.data?.some((item) => item.id === id),
      ),
    });
  }, [filiais.data, filialSelecionada, filialUnica, servicos.isPending, servicos.data, rascunho.idFilial, rascunho.servicoIds, alterar]);
  const barbeiros = useQuery({
    queryKey: ["agendar", "barbeiros", idFilial],
    queryFn: ({ signal }) => buscarBarbeiros(idFilial!, signal),
    enabled: !!filial && rascunho.idFilial === idFilial,
    staleTime: 0,
  });
  const barbeiro =
    rascunho.idFilial === idFilial
      ? barbeiros.data?.find((item) => item.id === rascunho.idBarbeiro)
      : undefined;
  const selecionados =
    servicos.data?.filter((item) => rascunho.servicoIds.includes(item.id)) ??
    [];
  const servicosValidos =
    selecionados.length > 0 &&
    selecionados.length === rascunho.servicoIds.length;
  const parametros = {
    idFilial: idFilial!,
    idBarbeiro: rascunho.idBarbeiro!,
    data: rascunho.data,
    servicoIds: [...rascunho.servicoIds].sort((a, b) => a - b),
  };
  const horarios = useQuery({
    queryKey: ["agendar", "horarios", parametros],
    queryFn: ({ signal }) => buscarHorarios(parametros, signal),
    enabled: !!filial && !!barbeiro && servicosValidos && !!rascunho.data,
    staleTime: 0,
    retry: false,
  });
  const horarioValido =
    !!rascunho.inicio &&
    new Date(rascunho.inicio) > new Date() &&
    !!horarios.data?.horarios.some((item) => item.inicio === rascunho.inicio) &&
    !horarios.isError &&
    !horarios.isFetching;
  const etapas = [
    ...(filiais.data?.length === 1 ? [] : ["Filial"]),
    "Barbeiro",
    "Serviços",
    "Data e horário",
    "Confirmar",
  ];
  const etapa = !filial && filiais.data?.length
    ? etapas[0]
    : etapas.includes(rascunho.etapa) ? rascunho.etapa : etapas[0];
  const indice = etapas.indexOf(etapa);
  const podeAvancar =
    etapa === "Filial"
      ? !!filial
      : etapa === "Barbeiro"
        ? !!filial && !!barbeiro
        : etapa === "Serviços"
          ? !!barbeiro && servicosValidos
          : horarioValido;
  function ir(destino: string) {
    definirAviso("");
    alterar({ tipo: "atualizar", dados: { etapa: destino } });
    if (destino === "Confirmar") void horarios.refetch();
  }
  const criacao = useMutation({
    retry: false,
    mutationFn: async () => {
      if (!usuario || usuario.papel !== "CLIENTE")
        throw new ErroAgendamento(401, "Entre com uma conta de cliente.");
      const [filiaisAtuais, barbeirosAtuais, servicosAtuais] =
        await Promise.all([
          buscarFiliais(),
          buscarBarbeiros(idFilial!),
          buscarServicos(),
        ]);
      if (
        !filiaisAtuais.some((i) => i.id === idFilial) ||
        !barbeirosAtuais.some((i) => i.id === rascunho.idBarbeiro) ||
        !rascunho.servicoIds.every((id) =>
          servicosAtuais.some((s) => s.id === id),
        )
      )
        throw new ErroAgendamento(
          400,
          "Uma escolha deixou de estar disponível. Revise as etapas.",
        );
      const atuais = await buscarHorarios(parametros);
      if (!atuais.horarios.some((item) => item.inicio === rascunho.inicio))
        throw new ErroAgendamento(
          409,
          "Este horário não está mais disponível. Escolha outro.",
        );
      if (
        atuais.valorTotal !== horarios.data?.valorTotal ||
        atuais.duracaoTotalMinutos !== horarios.data?.duracaoTotalMinutos
      ) {
        await queryClient.invalidateQueries({ queryKey: ["agendar"] });
        throw new ErroAgendamento(
          400,
          "O preço ou a duração mudou. Confira o novo resumo antes de confirmar.",
        );
      }
      return criarAgendamento({
        idCliente: usuario.id,
        idFilial: idFilial!,
        idBarbeiro: rascunho.idBarbeiro!,
        servicoIds: rascunho.servicoIds,
        inicio: rascunho.inicio,
        observacaoCliente: rascunho.observacao.trim() || undefined,
      });
    },
    onSuccess: async () => {
      alterar({ tipo: "limpar" });
      await queryClient.invalidateQueries({ queryKey: ["meus-agendamentos"] });
    },
    onError: (erro) => {
      if (erro instanceof ErroAgendamento && erro.status === 409) {
        alterar({
          tipo: "atualizar",
          dados: { inicio: "", etapa: "Data e horário" },
        });
        definirAviso(erro.message);
        void horarios.refetch();
      } else if (
        erro instanceof ErroAgendamento &&
        [400, 404].includes(erro.status)
      ) {
        void queryClient.invalidateQueries({ queryKey: ["agendar"] });
      }
    },
  });
  return {
    rascunho,
    alterar,
    selecionarFilial,
    usuario,
    carregando,
    filiais,
    servicos,
    barbeiros,
    horarios,
    filial,
    barbeiro,
    selecionados,
    servicosValidos,
    horarioValido,
    etapas,
    etapa,
    indice,
    podeAvancar,
    ir,
    criacao,
    aviso,
  };
}
