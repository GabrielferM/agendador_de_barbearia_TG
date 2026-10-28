import { FormularioCadastro, estiloBotao } from './formulario-cadastro';
import type { CampoCadastro } from './formulario-cadastro';
import type { useGestaoCadastro } from './gestao-cadastro';
type Gestao = ReturnType<typeof useGestaoCadastro>;
export function EditorCadastro({ gestao: g, campos }: { gestao: Gestao; campos: CampoCadastro[] }) {
  return <>
    {g.aviso && <p role="status" className="my-3">{g.aviso}</p>}
    {g.abrir.isPending && <p role="status">Carregando cadastro…</p>}
    {g.abrir.error && <p role="alert">{g.abrir.error.message}</p>}
    {g.editor && <FormularioCadastro key={`${g.editor.id}-${g.editor.leitura}`} campos={campos} valores={g.editor.dados} somenteLeitura={g.editor.leitura} pendente={g.gravar.isPending} erro={g.gravar.error?.message} salvar={dados => g.gravar.mutate(dados)} fechar={() => g.setEditor(null)} />}
    {g.exclusao && <div role="alertdialog" aria-modal="false" aria-label="Confirmar exclusão" className="my-4 rounded-xl border border-danger bg-surface p-4">
      <p>Excluir {g.exclusao.nome}? Vínculos impedem a exclusão. Você também pode editar a situação do cadastro.</p>
      {g.remover.error && <p role="alert" className="text-danger">{g.remover.error.message}</p>}
      <div className="mt-3 flex flex-wrap gap-2"><button className={`${estiloBotao} text-danger`} disabled={g.remover.isPending} onClick={() => g.remover.mutate(g.exclusao!.id)}>Confirmar exclusão</button><button className={estiloBotao} disabled={g.remover.isPending} onClick={() => g.setExclusao(null)}>Cancelar</button></div>
    </div>}
  </>;
}
export function AcoesCadastro({ gestao: g, id, nome }: { gestao: Gestao; id: number; nome: string }) {
  return <div className="mt-3 flex flex-wrap gap-2">
    <button className={estiloBotao} disabled={g.abrir.isPending || g.gravar.isPending} aria-label={`Visualizar ${nome}`} onClick={() => g.abrir.mutate({ id, leitura: true })}>Visualizar</button>
    <button className={estiloBotao} disabled={g.abrir.isPending || g.gravar.isPending} aria-label={`Editar ${nome}`} onClick={() => g.abrir.mutate({ id, leitura: false })}>Editar</button>
    <button className={`${estiloBotao} text-danger`} aria-label={`Excluir ${nome}`} disabled={g.remover.isPending} onClick={() => { g.remover.reset(); g.setExclusao({ id, nome }); }}>Excluir</button>
  </div>;
}
