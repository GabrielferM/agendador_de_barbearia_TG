import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { estiloCampo } from "../components/formulario-cadastro";
import { IndicadoresServicos, CatalogoServicos } from "./components/components";
import { consultarServicos } from "./services/servicos-api";

import { PainelCatalogo, PaginacaoCatalogo } from "../components/painel-catalogo";

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
      titulo="Serviços"
      subtitulo="Consulte os serviços oferecidos pela barbearia"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar serviços.</p>
      ) : (
        <PainelCatalogo>
          {consulta.data && !consulta.isError && <IndicadoresServicos dados={consulta.data.indicadores} />}
          <div className="filtros-catalogo">
            <label >
              Buscar serviço
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
              <div className="min-w-0 p-4 pt-0"><CatalogoServicos servicos={consulta.data.data} /><p className="mt-4 text-sm text-foreground">Categorias e percentuais padrão de comissão ainda não são cadastrados no sistema.</p></div>
              <PaginacaoCatalogo pagina={pagina} totalPaginas={consulta.data.meta.totalPaginas} total={consulta.data.meta.total} entidade="serviços" mudar={setPagina} />
            </>
          )}
        </PainelCatalogo>
      )}
    </DashboardLayout>
  );
}
