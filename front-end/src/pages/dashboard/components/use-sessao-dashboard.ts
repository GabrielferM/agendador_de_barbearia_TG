import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ErroDashboard } from "../../../api/dashboard/dashboard";
import { useAutenticacao } from "../../../auth/contexto-autenticacao";

export function useSessaoDashboard(erro: Error | null) {
  const { encerrarSessaoLocal } = useAutenticacao();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(erro instanceof ErroDashboard) || erro.status !== 401) return;
    void encerrarSessaoLocal().finally(() => navigate("/login", { replace: true }));
  }, [encerrarSessaoLocal, erro, navigate]);
}
