import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@heroui/react";
export function DialogoOperacao({
  titulo,
  aberto,
  fechar,
  pendente = false,
  sujo = false,
  children,
}: {
  titulo: string;
  aberto: boolean;
  fechar: () => void;
  pendente?: boolean;
  sujo?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const foco = useRef<HTMLElement | null>(null);
  const id = useId();
  useEffect(() => {
    if (aberto) {
      foco.current = document.activeElement as HTMLElement;
      ref.current?.showModal();
    } else {
      ref.current?.close();
      foco.current?.focus();
    }
  }, [aberto]);
  function descartar() {
    if (
      !pendente &&
      (!sujo || window.confirm("Descartar as alterações não salvas?"))
    )
      fechar();
  }
  return (
    <dialog
      ref={ref}
      aria-labelledby={id}
      onCancel={(e) => {
        e.preventDefault();
        descartar();
      }}
      className="m-auto max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl border border-border bg-surface p-6 text-foreground backdrop:bg-foreground/40"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 id={id} className="font-serif text-2xl">
          {titulo}
        </h2>
        <Button variant="secondary" isDisabled={pendente} onPress={descartar}>
          Fechar
        </Button>
      </div>
      {children}
    </dialog>
  );
}
export function PaginacaoCadastros({
  pagina,
  totalPaginas,
  total,
  mudar,
}: {
  pagina: number;
  totalPaginas: number;
  total: number;
  mudar: (pagina: number) => void;
}) {
  return (
    <nav
      aria-label="Paginação"
      className="mt-5 flex flex-wrap items-center justify-between gap-3"
    >
      <Button
        variant="secondary"
        isDisabled={pagina <= 1}
        onPress={() => mudar(pagina - 1)}
      >
        Anterior
      </Button>
      <span>
        {total} registros · Página {pagina} de {Math.max(1, totalPaginas)}
      </span>
      <Button
        variant="secondary"
        isDisabled={pagina >= totalPaginas}
        onPress={() => mudar(pagina + 1)}
      >
        Próxima
      </Button>
    </nav>
  );
}
