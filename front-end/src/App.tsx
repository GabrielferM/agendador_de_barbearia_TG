import { AppRouter } from './routers'
import { ProvedorAutenticacao } from './auth/contexto-autenticacao'

export function App() {
  return <ProvedorAutenticacao><AppRouter /></ProvedorAutenticacao>
}

export default App
