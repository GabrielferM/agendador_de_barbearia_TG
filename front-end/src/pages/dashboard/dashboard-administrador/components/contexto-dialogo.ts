import { createContext, useContext } from 'react';

export const ContextoDialogo = createContext<{
  definirAlterado: (alterado: boolean) => void;
  solicitarFechamento: () => void;
} | null>(null);

export const useDialogoAdministrativo = () => useContext(ContextoDialogo);
