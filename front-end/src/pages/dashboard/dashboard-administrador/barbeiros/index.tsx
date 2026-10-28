import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAutenticacao } from "../../../../auth/contexto-autenticacao";
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from "../../components/dashboard-compartilhado";
import { MENU_ADMINISTRADOR } from "../constants/menu-administrador";
import { estiloBotao, estiloCampo, estiloPrimario } from "../components/formulario-cadastro";
import {
  IndicadoresBarbeiros,
  CartoesBarbeiros,
} from "./components/components";
import { consultarBarbeiros } from "./services/barbeiros-api";

import { useGestaoCadastro } from '../components/gestao-cadastro';
import { EditorCadastro, AcoesCadastro } from '../components/editor-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import { buscarBarbeiro, salvarBarbeiro, excluirBarbeiro, listarFiliaisCadastro } from './services/gestao-barbeiros-api';

export function BarbeirosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes("GERENCIAR_USUARIOS");
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");
  const [pagina, setPagina] = useState(1);
  const gestao = useGestaoCadastro({ buscar: buscarBarbeiro, salvar: salvarBarbeiro, excluir: excluirBarbeiro }, () => setPagina(1));
  const filiais = useQuery({ queryKey: ['admin', usuario?.id, 'filiais-cadastro'], enabled: permitido && !!gestao.editor, queryFn: ({ signal }) => listarFiliaisCadastro(signal) });
  const campos: CampoCadastro[] = [
    { nome: 'nome', rotulo: 'Nome', obrigatorio: true, tamanhoMinimo: 2 }, { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true },
    ...(!gestao.editor?.leitura ? [{ nome: 'senha', rotulo: gestao.editor?.id ? 'Nova senha (opcional)' : 'Senha', tipo: 'password' as const, obrigatorio: gestao.editor?.id === null, tamanhoMinimo: 15 }] : []),
    { nome: 'nomeProfissional', rotulo: 'Nome profissional' }, { nome: 'descricao', rotulo: 'Descrição' }, { nome: 'fotoUrl', rotulo: 'Foto (URL)', tipo: 'url' }, { nome: 'dataAdmissao', rotulo: 'Admissão', tipo: 'date' },
    { nome: 'idFilial', rotulo: 'Filial', obrigatorio: true, opcoes: filiais.data ?? [] },
    { nome: 'statusProfissional', rotulo: 'Status profissional', opcoes: ['ATIVO','INATIVO','AFASTADO'].map(valor => ({ valor, rotulo: valor })) },
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
        <>
          <div className="admin-toolbar">
            <label className="flex-1">
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
          <button className={estiloPrimario} disabled={gestao.gravar.isPending || gestao.abrir.isPending} onClick={gestao.novo}>Novo barbeiro</button>
          {gestao.editor && (filiais.isPending ? <p role="status">Carregando filiais…</p> : filiais.isError ? <EstadoErro mensagem={filiais.error.message} tentarNovamente={() => void filiais.refetch()} /> : !filiais.data.length ? <p role="alert">Nenhuma filial cadastrada. Cadastre uma filial antes de incluir o profissional.</p> : null)}
          {(!gestao.editor || filiais.isSuccess && !!filiais.data.length) && <EditorCadastro gestao={gestao} campos={campos} />}
          <p className="my-3 text-sm text-muted">O status profissional controla o cadastro da equipe. Ele é independente do status de acesso da conta.</p>
          {consulta.isPending ? (
            <EstadoCarregamento />
          ) : consulta.isError ? (
            <EstadoErro
              mensagem={consulta.error.message}
              tentarNovamente={() => void consulta.refetch()}
            />
          ) : (
            <>
              <IndicadoresBarbeiros dados={consulta.data.indicadores} />
              <CartoesBarbeiros barbeiros={consulta.data.data} acoes={b => <AcoesCadastro gestao={gestao} id={b.id} nome={b.nome} />} />
              <nav
                aria-label="Paginação de barbeiros"
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
                  {consulta.data.meta.total} barbeiros
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
