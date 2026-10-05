import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";

import {
  reduzirRascunho,
  rascunhoInicial,
  type RascunhoAgendamento,
  type AcaoRascunho,
} from "./estado-agendamento";
const Contexto = createContext<{
  rascunho: RascunhoAgendamento;
  alterar: React.Dispatch<AcaoRascunho>;
} | null>(null);
export function ProvedorRascunhoAgendamento({
  children,
}: {
  children: ReactNode;
}) {
  const [rascunho, alterar] = useReducer(reduzirRascunho, rascunhoInicial);
  useEffect(() => {
    const limpar = () => alterar({ tipo: "limpar" });
    window.addEventListener("agendador:logout", limpar);
    return () => window.removeEventListener("agendador:logout", limpar);
  }, []);
  return (
    <Contexto.Provider value={{ rascunho, alterar }}>
      {children}
    </Contexto.Provider>
  );
}
// API coesa do estado transitório da jornada.
// eslint-disable-next-line react-refresh/only-export-components
export function useRascunhoAgendamento() {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error("Provedor de agendamento ausente.");
  return contexto;
}
