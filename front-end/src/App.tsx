import { ProvedorRascunhoAgendamento } from "./pages/agendamento/rascunho-agendamento";
import { AppRouter } from "./routers";
import { ProvedorAutenticacao } from "./auth/contexto-autenticacao";

export function App() {
  return (
    <ProvedorAutenticacao>
      <ProvedorRascunhoAgendamento>
        <AppRouter />
      </ProvedorRascunhoAgendamento>
    </ProvedorAutenticacao>
  );
}

export default App;
