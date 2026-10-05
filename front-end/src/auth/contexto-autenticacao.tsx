import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  autenticacaoControllerLogout,
  autenticacaoControllerMe,
} from "../api/autenticação/autenticação";
import type { CodigoPapel, UsuarioAutenticado } from "../pages/login/types";
import { EVENTO_SESSAO_EXPIRADA } from "../api/http-client";

interface EstadoAutenticacao {
  usuario: UsuarioAutenticado | null;
  carregando: boolean;
  logoutNaoConfirmado: boolean;
  definirUsuario: (usuario: UsuarioAutenticado) => Promise<void>;
  encerrarSessaoLocal: () => Promise<void>;
  sair: () => Promise<boolean>;
}

const Contexto = createContext<EstadoAutenticacao>({
  usuario: null,
  carregando: false,
  logoutNaoConfirmado: false,
  definirUsuario: async () => undefined,
  encerrarSessaoLocal: async () => undefined,
  sair: async () => false,
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
  const queryClient = useQueryClient();
  const [usuario, setUsuario] = useState<UsuarioAutenticado | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [logoutNaoConfirmado, setLogoutNaoConfirmado] = useState(false);

  const limparDadosLocais = useCallback(async () => {
    setUsuario(null);
    await queryClient.cancelQueries();
    queryClient.clear();
  }, [queryClient]);

  const encerrarSessaoLocal = useCallback(async () => {
    setLogoutNaoConfirmado(false);
    await limparDadosLocais();
  }, [limparDadosLocais]);

  useEffect(() => {
    const encerrar = () => void encerrarSessaoLocal();
    window.addEventListener(EVENTO_SESSAO_EXPIRADA, encerrar);
    return () => window.removeEventListener(EVENTO_SESSAO_EXPIRADA, encerrar);
  }, [encerrarSessaoLocal]);

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

  const definirUsuario = useCallback(
    async (novoUsuario: UsuarioAutenticado) => {
      await queryClient.cancelQueries();
      queryClient.clear();
      setLogoutNaoConfirmado(false);
      setUsuario(novoUsuario);
    },
    [queryClient],
  );

  const sair = useCallback(async (): Promise<boolean> => {
    window.dispatchEvent(new Event("agendador:logout"));
    let confirmado = false;
    try {
      const resposta = await autenticacaoControllerLogout();
      confirmado = resposta.status >= 200 && resposta.status < 300;
    } catch {
      confirmado = false;
    } finally {
      setLogoutNaoConfirmado(!confirmado);
      await limparDadosLocais();
    }
    return confirmado;
  }, [limparDadosLocais]);

  return (
    <Contexto.Provider
      value={{
        usuario,
        carregando,
        logoutNaoConfirmado,
        definirUsuario,
        encerrarSessaoLocal,
        sair,
      }}
    >
      {children}
    </Contexto.Provider>
  );
}

// O provider e seu hook ficam juntos para manter a API de autenticação coesa.
// eslint-disable-next-line react-refresh/only-export-components
export const useAutenticacao = () => useContext(Contexto);
