import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { FormularioCadastro, estiloBotao, estiloCampo } from "../components/formulario-cadastro";
import type { CampoCadastro } from "../components/formulario-cadastro";
import {
  IndicadoresBarbeiros,
  CartoesBarbeiros,
} from "./components/components";
import { consultarBarbeiros, consultarFiliaisCadastro, criarBarbeiro } from "./services/barbeiros-api";

import { PainelCatalogo, PaginacaoCatalogo } from "../components/painel-catalogo";

export function BarbeirosAdministrador() {
  const { usuario } = useAutenticacao();
  const cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const [cadastrando, setCadastrando] = useState(false);
  const [aviso, setAviso] = useState("");
  const filiais = useQuery({
    queryKey: ["admin", usuario?.id, "filiais-cadastro-barbeiro"],
    enabled: permitido && cadastrando,
    queryFn: ({ signal }) => consultarFiliaisCadastro(signal),
  });
  const gravar = useMutation({
    mutationFn: criarBarbeiro,
    retry: false,
    onSuccess: async () => {
      setCadastrando(false);
      setAviso("Conta de barbeiro criada. O acesso já pode ser feito com o e-mail e a senha cadastrados.");
      setBusca("");
      setStatus("");
      setPagina(1);
      await cache.invalidateQueries({ queryKey: ["admin", usuario?.id] });
      await cache.invalidateQueries({ queryKey: ["inicio", "barbeiros"] });
      await cache.invalidateQueries({ queryKey: ["agendar", "barbeiros"] });
    },
  });
  const campos: CampoCadastro[] = [
    { nome: "nome", rotulo: "Nome", obrigatorio: true, tamanhoMinimo: 2 },
    { nome: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true },
    { nome: "senha", rotulo: "Senha (15 a 128 caracteres)", tipo: "password", obrigatorio: true, tamanhoMinimo: 15 },
    { nome: "idFilial", rotulo: "Filial", obrigatorio: true, opcoes: (filiais.data ?? []).map(f => ({ valor: String(f.id), rotulo: f.nome })) },
    { nome: "nomeProfissional", rotulo: "Nome profissional (opcional)" },
    { nome: "descricao", rotulo: "Descrição (opcional)" },
    { nome: "fotoUrl", rotulo: "URL da foto (opcional)", tipo: "url" },
    { nome: "dataAdmissao", rotulo: "Data de admissão (opcional)", tipo: "date" },
  ];
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
            <button className={`${estiloBotao} bg-primary! text-white sm:ml-auto`} disabled={cadastrando} onClick={() => { gravar.reset(); setAviso(""); setCadastrando(true); }}>Novo barbeiro</button>
          </div>
          {aviso && <p role="status" className="px-4 pb-4">{aviso}</p>}
          {cadastrando && <div className="px-4">
            <h2 className="font-semibold">Criar conta de barbeiro</h2>
            {filiais.isPending ? <EstadoCarregamento /> : filiais.isError ? <EstadoErro mensagem={filiais.error.message} tentarNovamente={() => void filiais.refetch()} /> : !filiais.data.length ? <p role="status">Nenhuma filial ativa disponível. Cadastre ou ative uma filial antes de criar a conta.</p> :
              <FormularioCadastro campos={campos} valores={{ idFilial: filiais.data.length === 1 ? String(filiais.data[0].id) : "" }} pendente={gravar.isPending} erro={gravar.error?.message} salvar={dados => gravar.mutate(dados)} fechar={() => { setCadastrando(false); gravar.reset(); }} />}
            {(!filiais.data?.length || filiais.isError) && <button className={`${estiloBotao} my-3`} onClick={() => setCadastrando(false)}>Fechar</button>}
          </div>}
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
