import { useState } from 'react';
import { useQuery, type QueryFunction, type QueryKey } from '@tanstack/react-query';

/** Retém apenas o último resultado válido da mesma tela e sessão. */
export function useConsultaListagem<T>({
  queryKey,
  enabled,
  ...opcoes
}: {
  queryKey: QueryKey;
  queryFn: QueryFunction<T>;
  enabled: boolean;
  staleTime?: number;
  retry?: false;
}) {
  // As três primeiras partes identificam aplicação, usuário e listagem.
  const escopo = JSON.stringify(queryKey.slice(0, 3));
  const consulta = useQuery({
    ...opcoes,
    queryKey,
    enabled,
    placeholderData: (anterior, queryAnterior) =>
      enabled && JSON.stringify(queryAnterior?.queryKey.slice(0, 3)) === escopo &&
      !acessoNegado(queryAnterior?.state.error)
        ? anterior
        : undefined,
  });
  const [ultimo, setUltimo] = useState<{ escopo: string; dados?: T }>({ escopo });
  const bloqueada = !enabled || acessoNegado(consulta.error);
  const mesmoEscopo = ultimo.escopo === escopo;

  // Ajuste condicionado durante o render evita exibir um frame de outra sessão.
  if (!mesmoEscopo || (bloqueada && ultimo.dados !== undefined)) {
    setUltimo({ escopo });
  } else if (!bloqueada && consulta.isSuccess && !consulta.isPlaceholderData &&
    consulta.data !== ultimo.dados) {
    setUltimo({ escopo, dados: consulta.data });
  }

  const dados = bloqueada ? undefined : consulta.data ?? (mesmoEscopo ? ultimo.dados : undefined);
  return { ...consulta, data: dados };
}

function acessoNegado(erro: unknown) {
  return !!erro && typeof erro === 'object' && 'status' in erro &&
    (erro.status === 401 || erro.status === 403);
}
