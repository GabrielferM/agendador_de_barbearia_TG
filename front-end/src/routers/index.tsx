import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { PaginaEmConstrucao } from "../pages/dashboard";
import { DashboardAdministrador } from "../pages/dashboard/dashboard-administrador";
import { AgendamentosAdministrador } from "../pages/dashboard/dashboard-administrador/agendamentos";
import { BarbeirosAdministrador } from "../pages/dashboard/dashboard-administrador/barbeiros";
import { ClientesAdministrador } from "../pages/dashboard/dashboard-administrador/clientes";
import { FinanceiroAdministrador } from "../pages/dashboard/dashboard-administrador/financeiro";
import { ServicosAdministrador } from "../pages/dashboard/dashboard-administrador/servicos";
import { DashboardBarbeiro } from "../pages/dashboard/dashboard-barbeiro";
import { Inicio } from "../pages/inicio";
import { Login } from "../pages/login";
import { useAutenticacao } from "../auth/contexto-autenticacao";
import type { CodigoPapel } from "../pages/login/types";
import type { ReactNode } from "react";

function RotaProtegida({
  papel,
  children,
}: {
  papel: CodigoPapel;
  children: ReactNode;
}) {
  const { usuario, carregando } = useAutenticacao();
  if (carregando)
    return (
      <main className="grid min-h-screen place-items-center">
        Carregando sessão…
      </main>
    );
  if (!usuario) return <Navigate replace to="/login" />;
  if (usuario.papel !== papel)
    return (
      <Navigate
        replace
        to={
          usuario.papel === "CLIENTE"
            ? "/cliente"
            : usuario.papel === "BARBEIRO"
              ? "/barbeiro"
              : "/admin"
        }
      />
    );
  return children;
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Inicio />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route
          element={
            <RotaProtegida papel="CLIENTE">
              <PaginaEmConstrucao
                descricao="Seus agendamentos e preferências ficarão disponíveis aqui."
                titulo="Área do cliente"
              />
            </RotaProtegida>
          }
          path="/cliente"
        />
        <Route
          element={
            <RotaProtegida papel="BARBEIRO">
              <DashboardBarbeiro />
            </RotaProtegida>
          }
          path="/barbeiro"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <DashboardAdministrador />
            </RotaProtegida>
          }
          path="/admin"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <AgendamentosAdministrador />
            </RotaProtegida>
          }
          path="/admin/agendamentos"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <ClientesAdministrador />
            </RotaProtegida>
          }
          path="/admin/clientes"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <BarbeirosAdministrador />
            </RotaProtegida>
          }
          path="/admin/barbeiros"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <ServicosAdministrador />
            </RotaProtegida>
          }
          path="/admin/servicos"
        />
        <Route
          element={
            <RotaProtegida papel="ADMINISTRADOR">
              <FinanceiroAdministrador />
            </RotaProtegida>
          }
          path="/admin/financeiro"
        />
        <Route
          element={
            <PaginaEmConstrucao
              descricao="O cadastro online será disponibilizado em breve."
              titulo="Criar conta"
            />
          }
          path="/cadastro"
        />
        <Route
          element={
            <PaginaEmConstrucao
              descricao="A recuperação segura de senha será disponibilizada em breve."
              titulo="Recuperar senha"
            />
          }
          path="/recuperar-senha"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  );
}
