import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  autenticacaoControllerLogout,
  autenticacaoControllerMe,
} from "../api/autenticação/autenticação";
import type { CodigoPapel, UsuarioAutenticado } from "../pages/login/types";

interface EstadoAutenticacao {
  usuario: UsuarioAutenticado | null;
  carregando: boolean;
  definirUsuario: (usuario: UsuarioAutenticado) => void;
  sair: () => Promise<void>;
}

const Contexto = createContext<EstadoAutenticacao>({
  usuario: null,
  carregando: false,
  definirUsuario: () => undefined,
  sair: async () => undefined,
});

function usuarioValido(valor: unknown): valor is UsuarioAutenticado {
  if (!valor || typeof valor !== "object") return false;
  const item = valor as Record<string, unknown>;
  return (
    typeof item.id === "number" &&
    typeof item.nome === "string" &&
    typeof item.email === "string" &&
    ["CLIENTE", "BARBEIRO", "ADMINISTRADOR"].includes(
      item.papel as CodigoPapel,
    ) &&
    Array.isArray(item.permissoes)
  );
}

export function ProvedorAutenticacao({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    let ativo = true;
    autenticacaoControllerMe()
      .then((resposta) => {
        if (
          ativo &&
          resposta.status === 200 &&
          usuarioValido(resposta.data.usuario)
        )
          setUsuario(resposta.data.usuario as UsuarioAutenticado);
      })
      .catch(() => undefined)
      .finally(() => {
        if (ativo) setCarregando(false);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const sair = useCallback(async () => {
    try {
      await autenticacaoControllerLogout();
    } finally {
      setUsuario(null);
    }
  }, []);

  return (
    <Contexto.Provider
      value={{ usuario, carregando, definirUsuario: setUsuario, sair }}
    >
      {children}
    </Contexto.Provider>
  );
}

// O provider e seu hook ficam juntos para manter a API de autenticação coesa.
// eslint-disable-next-line react-refresh/only-export-components
export const useAutenticacao = () => useContext(Contexto);
