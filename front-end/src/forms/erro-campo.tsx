export function ErroCampo({ id, mensagem }: { id: string; mensagem?: string }) {
  return mensagem ? (
    <p id={id} role="alert" className="mt-1 text-sm text-danger">
      {mensagem}
    </p>
  ) : null;
}
