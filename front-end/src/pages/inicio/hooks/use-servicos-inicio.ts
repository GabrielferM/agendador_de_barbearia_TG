import { useQuery } from "@tanstack/react-query";
import { buscarServicosInicio } from "../services/catalogo-inicio";

export interface ServicoInicio {
  id: number;
  icone: string;
  nome: string;
  duracao: string;
  preco: string;
}

const formatarDuracao = (minutos: number) =>
  `${minutos} ${minutos === 1 ? "minuto" : "minutos"}`;

const formatarPreco = (precoBase: string) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(precoBase));

export function useServicosInicio() {
  const query = useQuery({
    queryKey: ["inicio", "servicos"],
    queryFn: ({ signal }) => buscarServicosInicio(signal),
  });

  return {
    ...query,
    comErro: query.isError,
    itens: (query.data ?? []).map<ServicoInicio>((servico) => ({
      id: servico.id,
      icone: "✂",
      nome: servico.nome,
      duracao: formatarDuracao(servico.duracaoMinutos),
      preco: formatarPreco(servico.precoBase),
    })),
  };
}
