import { useQuery } from "@tanstack/react-query";
import { buscarBarbeirosInicio } from "../services/catalogo-inicio";

export interface BarbeiroInicio {
  id: number;
  nome: string;
  descricao: string | null;
  fotoUrl: string | null;
}

export function useBarbeirosInicio() {
  const query = useQuery({
    queryKey: ["inicio", "barbeiros"],
    queryFn: ({ signal }) => buscarBarbeirosInicio(signal),
  });

  return {
    ...query,
    comErro: query.isError,
    itens: (query.data ?? []).map<BarbeiroInicio>((barbeiro) => ({
      id: barbeiro.id,
      nome: barbeiro.nomeProfissional,
      descricao: barbeiro.descricao ?? null,
      fotoUrl: barbeiro.fotoUrl ?? null,
    })),
  };
}
