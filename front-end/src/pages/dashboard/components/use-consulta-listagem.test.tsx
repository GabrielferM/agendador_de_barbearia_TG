import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { ReactNode } from 'react';
import { useConsultaListagem } from './use-consulta-listagem';

function promessa<T>() {
  let resolver!: (valor: T) => void;
  let rejeitar!: (erro: Error) => void;
  const promise = new Promise<T>((resolve, reject) => { resolver = resolve; rejeitar = reject; });
  return { promise, resolver, rejeitar };
}
function contexto() {
  const cache = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={cache}>{children}</QueryClientProvider>
  );
}
const dados = { data: ['Maria'], meta: { pagina: 2, totalPaginas: 3 } };

it('retém a página anterior durante nova consulta, falha e tentativa de recuperação', async () => {
  const pendente = promessa<typeof dados>();
  const buscar = vi.fn().mockResolvedValueOnce(dados).mockImplementationOnce(() => pendente.promise)
    .mockResolvedValueOnce({ ...dados, data: [], meta: { pagina: 1, totalPaginas: 0 } });
  const { result, rerender } = renderHook(({ busca }) => useConsultaListagem({
    queryKey: ['admin', 1, 'clientes', busca], enabled: true, queryFn: buscar,
  }), { initialProps: { busca: '' }, wrapper: contexto() });
  await waitFor(() => expect(result.current.data).toEqual(dados));
  rerender({ busca: 'outra' });
  expect(result.current.isFetching).toBe(true);
  expect(result.current.isPlaceholderData).toBe(true);
  expect(result.current.data).toEqual(dados);
  await act(async () => pendente.rejeitar(new Error('Indisponível')));
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.data).toEqual(dados);
  await act(async () => { await result.current.refetch(); });
  await waitFor(() => expect(result.current.data?.data).toEqual([]));
  expect(result.current.data?.meta.pagina).toBe(1);
});

it.each([401, 403])('retira resultados anteriores quando o servidor responde %s', async (status) => {
  const buscar = vi.fn().mockResolvedValueOnce(dados)
    .mockRejectedValueOnce(Object.assign(new Error('Sem acesso'), { status }));
  const { result, rerender } = renderHook(({ busca }) => useConsultaListagem({
    queryKey: ['admin', 1, 'clientes', busca], enabled: true, queryFn: buscar,
  }), { initialProps: { busca: '' }, wrapper: contexto() });
  await waitFor(() => expect(result.current.data).toEqual(dados));
  rerender({ busca: 'nova' });
  await waitFor(() => expect(result.current.isError).toBe(true));
  expect(result.current.data).toBeUndefined();
});

it('não compartilha resultados entre usuários, telas ou consultas desabilitadas', async () => {
  const buscar = vi.fn().mockResolvedValueOnce(dados).mockImplementation(() => new Promise(() => {}));
  const { result, rerender } = renderHook(({ usuario, tela, enabled }) => useConsultaListagem({
    queryKey: ['admin', usuario, tela], enabled, queryFn: buscar,
  }), { initialProps: { usuario: 1, tela: 'clientes', enabled: true }, wrapper: contexto() });
  await waitFor(() => expect(result.current.data).toEqual(dados));
  rerender({ usuario: 2, tela: 'clientes', enabled: true });
  expect(result.current.data).toBeUndefined();
  rerender({ usuario: 1, tela: 'servicos', enabled: true });
  expect(result.current.data).toBeUndefined();
  rerender({ usuario: 1, tela: 'clientes', enabled: false });
  expect(result.current.data).toBeUndefined();
});

it('encaminha o cancelamento da consulta anterior ao trocar a busca', async () => {
  const sinais: AbortSignal[] = [];
  const { rerender } = renderHook(({ busca }) => useConsultaListagem({
    queryKey: ['admin', 1, 'clientes', busca], enabled: true,
    queryFn: ({ signal }) => { sinais.push(signal); return new Promise(() => {}); },
  }), { initialProps: { busca: '' }, wrapper: contexto() });
  rerender({ busca: 'nova' });
  expect(sinais[0].aborted).toBe(true);
  expect(sinais[1].aborted).toBe(false);
});
