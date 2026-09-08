import { useCatalogoPublicoControllerBarbeiros } from "../../../api/catálogo-público/catálogo-público";

export interface BarbeiroInicio {
  id: number;
  nome: string;
  descricao: string | null;
  fotoUrl: string | null;
}

export function useBarbeirosInicio() {
  const query = useCatalogoPublicoControllerBarbeiros({ pagina: 1, limite: 3 });
  const resposta = query.data?.status === 200 ? query.data.data : undefined;
  const comErro =
    query.isError || (query.data !== undefined && query.data.status !== 200);

  return {
    ...query,
    comErro,
    itens: (resposta?.data ?? []).map<BarbeiroInicio>((barbeiro) => ({
      id: barbeiro.id,
      nome: barbeiro.nomeProfissional,
      descricao: barbeiro.descricao ?? null,
      fotoUrl: barbeiro.fotoUrl ?? null,
    })),
  };
}
