import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PaginaEmConstrucao } from '../pages/em-construcao'
import { Inicio } from '../pages/inicio'
import { Login } from '../pages/login'
import { useAutenticacao } from '../auth/contexto-autenticacao'
import type { CodigoPapel } from '../pages/login/types'
import type { ReactNode } from 'react'

function RotaProtegida({ papel, children }: { papel: CodigoPapel; children: ReactNode }) {
  const { usuario, carregando } = useAutenticacao()
  if (carregando) return <main className="grid min-h-screen place-items-center">Carregando sessão…</main>
  if (!usuario) return <Navigate replace to="/login" />
  if (usuario.papel !== papel) return <Navigate replace to={usuario.papel === 'CLIENTE' ? '/cliente' : usuario.papel === 'BARBEIRO' ? '/barbeiro' : '/admin'} />
  return children
}

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Inicio />} path="/" />
        <Route element={<Login />} path="/login" />
        <Route
          element={<RotaProtegida papel="CLIENTE"><PaginaEmConstrucao descricao="Seus agendamentos e preferências ficarão disponíveis aqui." titulo="Área do cliente" /></RotaProtegida>}
          path="/cliente"
        />
        <Route
          element={<RotaProtegida papel="BARBEIRO"><PaginaEmConstrucao descricao="Sua agenda profissional ficará disponível aqui." titulo="Área do barbeiro" /></RotaProtegida>}
          path="/barbeiro"
        />
        <Route
          element={<RotaProtegida papel="ADMINISTRADOR"><PaginaEmConstrucao descricao="A gestão da barbearia ficará disponível aqui." titulo="Área administrativa" /></RotaProtegida>}
          path="/admin"
        />
        <Route
          element={<PaginaEmConstrucao descricao="O cadastro online será disponibilizado em breve." titulo="Criar conta" />}
          path="/cadastro"
        />
        <Route
          element={<PaginaEmConstrucao descricao="A recuperação segura de senha será disponibilizada em breve." titulo="Recuperar senha" />}
          path="/recuperar-senha"
        />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </BrowserRouter>
  )
}
