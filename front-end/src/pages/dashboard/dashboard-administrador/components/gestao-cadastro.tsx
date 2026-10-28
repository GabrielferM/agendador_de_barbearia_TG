import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';

export interface OperacoesCadastro {
  buscar: (id: number) => Promise<Record<string, string>>;
  salvar: (id: number | null, dados: Record<string, string>) => Promise<unknown>;
  excluir: (id: number) => Promise<unknown>;
}
export function useGestaoCadastro(operacoes: OperacoesCadastro, aposExcluir: () => void) {
  const { usuario } = useAutenticacao(), cache = useQueryClient();
  const [editor, setEditor] = useState<{ id: number | null; dados: Record<string, string>; leitura: boolean } | null>(null);
  const [exclusao, setExclusao] = useState<{ id: number; nome: string } | null>(null);
  const [aviso, setAviso] = useState('');
  async function atualizar() {
    await Promise.all([
      cache.invalidateQueries({ queryKey: ['admin', usuario?.id] }),
      cache.invalidateQueries({ queryKey: ['dashboard', 'administrador', usuario?.id] }),
      cache.invalidateQueries({ queryKey: ['inicio'] }),
      cache.invalidateQueries({ queryKey: ['agendar'] }),
    ]);
  }
  const abrir = useMutation({ mutationFn: async ({ id, leitura }: { id: number; leitura: boolean }) => ({ id, leitura, dados: await operacoes.buscar(id) }), onSuccess: dados => { gravar.reset(); setEditor(dados); setAviso(''); } });
  const gravar = useMutation({ mutationFn: (dados: Record<string, string>) => operacoes.salvar(editor!.id, dados), onSuccess: async () => { setEditor(null); setAviso('Cadastro salvo.'); await atualizar(); } });
  const remover = useMutation({ mutationFn: operacoes.excluir, onSuccess: async () => { setExclusao(null); setAviso('Cadastro excluído.'); aposExcluir(); await atualizar(); } });
  return { editor, setEditor, exclusao, setExclusao, aviso, abrir, gravar, remover,
    novo: () => { abrir.reset(); gravar.reset(); remover.reset(); setEditor({ id: null, dados: {}, leitura: false }); setAviso(''); },
  };
}
