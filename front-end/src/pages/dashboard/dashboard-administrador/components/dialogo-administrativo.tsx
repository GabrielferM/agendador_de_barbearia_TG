import { Modal } from '@heroui/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ContextoDialogo } from './contexto-dialogo';

export function DialogoAdministrativo({
  titulo,
  pendente = false,
  fechar,
  children,
}: {
  titulo: string;
  pendente?: boolean;
  fechar: () => void;
  children: ReactNode;
}) {
  const [alterado, definirAlterado] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [origem] = useState(() =>
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const origemConfirmacao = useRef<HTMLElement | null>(null);
  const montado = useRef(false);
  useEffect(() => {
    montado.current = true;
    return () => {
      montado.current = false;
      window.setTimeout(() => {
        // O StrictMode também executa a limpeza durante a montagem.
        if (montado.current) return;
        const destino =
          origem?.isConnected && !origem.matches(':disabled')
            ? origem
            : document.querySelector<HTMLElement>('[data-novo-cadastro]');
        destino?.focus();
      }, 0);
    };
  }, [origem]);
  useEffect(() => {
    if (confirmando || !origemConfirmacao.current) return;
    const quadro = window.requestAnimationFrame(() =>
      origemConfirmacao.current?.focus(),
    );
    return () => window.cancelAnimationFrame(quadro);
  }, [confirmando]);
  const solicitarFechamento = useCallback(() => {
    if (pendente) return;
    if (confirmando) setConfirmando(false);
    else if (alterado) {
      origemConfirmacao.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setConfirmando(true);
    } else fechar();
  }, [pendente, confirmando, alterado, fechar]);
  return (
    <ContextoDialogo.Provider value={{ definirAlterado, solicitarFechamento }}>
      <Modal.Backdrop
        isOpen
        onOpenChange={(aberto) => {
          if (!aberto) solicitarFechamento();
        }}
        isDismissable={!pendente}
        isKeyboardDismissDisabled={pendente}
      >
        <Modal.Container size="lg" scroll="inside">
          <Modal.Dialog className="min-w-0 max-w-160 bg-surface text-foreground">
            <Modal.Header>
              <Modal.Heading>
                {confirmando ? 'Descartar alterações?' : titulo}
              </Modal.Heading>
            </Modal.Header>
            <Modal.Body className="min-w-0">
              <div hidden={confirmando}>{children}</div>
              {confirmando && (
                <>
                  <p>Os dados preenchidos ainda não foram salvos.</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      autoFocus
                      className="rounded-lg border border-border px-3 py-2 focus-visible:outline-primary"
                      onClick={() => setConfirmando(false)}
                    >
                      Continuar editando
                    </button>
                    <button
                      className="rounded-lg bg-primary px-3 py-2 text-white focus-visible:outline-primary"
                      onClick={fechar}
                    >
                      Descartar alterações
                    </button>
                  </div>
                </>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </ContextoDialogo.Provider>
  );
}
