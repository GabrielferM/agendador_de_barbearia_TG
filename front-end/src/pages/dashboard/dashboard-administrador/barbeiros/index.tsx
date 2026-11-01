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
import {
  IndicadoresBarbeiros,
  CartoesBarbeiros,
} from "./components/components";
import { consultarBarbeiros } from "./services/barbeiros-api";

import { PainelCatalogo, PaginacaoCatalogo } from "../components/painel-catalogo";

export function BarbeirosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const consulta = useQuery({
    queryKey: ["admin", usuario?.id, "barbeiros", busca, status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) => consultarBarbeiros(busca, status, pagina, signal),
    staleTime: 60_000,
  });
  return (
    <DashboardLayout
      titulo="Barbeiros"
      subtitulo="Consulte a equipe e acompanhe o desempenho"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar barbeiros.</p>
      ) : (
        <PainelCatalogo>
          {consulta.data && !consulta.isError && <IndicadoresBarbeiros dados={consulta.data.indicadores} />}
          <div className="filtros-catalogo">
            <label >
              Buscar barbeiro
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
                  ["ATIVO", "Ativo"],
                  ["INATIVO", "Inativo"],
                  ["AFASTADO", "Afastado"],
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
              <div className="min-w-0 p-4 pt-0"><CartoesBarbeiros barbeiros={consulta.data.data} /><p className="mt-4 text-sm text-foreground">Especialidades, jornada individual e percentual padrão de comissão ainda não são cadastrados no sistema.</p></div>
              <PaginacaoCatalogo pagina={pagina} totalPaginas={consulta.data.meta.totalPaginas} total={consulta.data.meta.total} entidade="barbeiros" mudar={setPagina} />
            </>
          )}
        </PainelCatalogo>
      )}
    </DashboardLayout>
  );
}
