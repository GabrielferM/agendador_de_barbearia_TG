import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { estiloBotao, estiloCampo } from "../components/formulario-cadastro";
import { IndicadoresServicos, CatalogoServicos } from "./components/components";
import { consultarServicos } from "./services/servicos-api";

export function ServicosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_SERVICOS");
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const consulta = useQuery({
    queryKey: ["admin", usuario?.id, "servicos", busca, status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) => consultarServicos(busca, status, pagina, signal),
    staleTime: 60_000,
  });
  return (
    <DashboardLayout
      titulo="Servicos"
      subtitulo="Consulte os serviços oferecidos pela barbearia"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar servicos.</p>
      ) : (
        <>
          <div className="admin-toolbar">
            <label className="flex-1">
              Buscar servico
              <input
                className={estiloCampo}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                  setPagina(1);
                }}
              />
            </label>
            <label>
              Status
              <select
                className={estiloCampo}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPagina(1);
                }}
              >
                <option value="">Todos</option>
                {[
                  ["true", "Ativo"],
                  ["false", "Inativo"],
                ].map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {consulta.isPending ? (
            <EstadoCarregamento />
          ) : consulta.isError ? (
            <EstadoErro
              mensagem={consulta.error.message}
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : (
            <>
              <IndicadoresServicos dados={consulta.data.indicadores} />
              <CatalogoServicos servicos={consulta.data.data} />
              <nav
                aria-label="Paginação de servicos"
                className="my-5 flex items-center gap-3"
              >
                <button
                  className={estiloBotao}
                  disabled={pagina <= 1}
                  onClick={() => setPagina(pagina - 1)}
                >
                  Anterior
                </button>
                <span>
                  Página {pagina} de{" "}
                  {Math.max(1, consulta.data.meta.totalPaginas)} ·{" "}
                  {consulta.data.meta.total} servicos
                </span>
                <button
                  className={estiloBotao}
                  disabled={pagina >= consulta.data.meta.totalPaginas}
                  onClick={() => setPagina(pagina + 1)}
                >
                  Próxima
                </button>
              </nav>

            </>
          )}
        </>
      )}
    </DashboardLayout>
  );
}
