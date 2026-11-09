import { useConsultaListagem } from '../../components/use-consulta-listagem';
import { ResultadosListagem } from '../../components/resultados-listagem';
import { DialogoAdministrativo } from '../components/dialogo-administrativo';
import {
  FormularioCadastro,
  estiloBotao,
} from '../components/formulario-cadastro';
import { schemaServico } from '../components/schemas-cadastro';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import { estiloCampo } from '../components/formulario-cadastro';
import { IndicadoresServicos, CatalogoServicos } from './components/components';
import {
  alterarStatusServico,
  consultarServicos,
  buscarServico,
  salvarServico,
} from './services/servicos-api';

import {
  PainelCatalogo,
  PaginacaoCatalogo,
} from '../components/painel-catalogo';

export function ServicosAdministrador() {
  const { usuario } = useAutenticacao();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_SERVICOS');
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [pagina, setPagina] = useState(1);
  const [filtrosAplicados, setFiltrosAplicados] = useState({ busca: '', status: '' });
  const cache = useQueryClient();
  const [aviso, setAviso] = useState('');
  const [editor, setEditor] = useState<{ id: number | null } | null>(null);
  const detalhe = useQuery({
    queryKey: ['admin', usuario?.id, 'servico', editor?.id],
    enabled: permitido && editor?.id != null,
    queryFn: ({ signal }) => buscarServico(editor!.id!, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const gravar = useMutation({
    mutationFn: (dados: Record<string, string>) =>
      salvarServico(editor!.id, dados),
    retry: false,
    onSuccess: async () => {
      setEditor(null);
      setAviso('Serviço salvo.');
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['admin', usuario?.id] }),
        cache.invalidateQueries({ queryKey: ['inicio', 'servicos'] }),
        cache.invalidateQueries({ queryKey: ['agendar'] }),
      ]);
    },
  });
  const alterarStatus = useMutation({
    mutationFn: ({ id, ativo }: { id: number; ativo: boolean }) =>
      alterarStatusServico(id, ativo),
    retry: false,
    onMutate: () => setAviso(''),
    onSuccess: async () => {
      setPagina(1);
      await Promise.all([
        cache.invalidateQueries({
          queryKey: ['admin', usuario?.id, 'servicos'],
        }),
        cache.invalidateQueries({ queryKey: ['inicio', 'servicos'] }),
        cache.invalidateQueries({ queryKey: ['agendar'] }),
      ]);
    },
  });
  const consulta = useConsultaListagem({
    queryKey: ['admin', usuario?.id, 'servicos', filtrosAplicados.busca, filtrosAplicados.status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) => consultarServicos(filtrosAplicados.busca, filtrosAplicados.status, pagina, signal),
    staleTime: 60_000,
  });
  return (
    <DashboardLayout
      titulo="Serviços"
      subtitulo="Gerencie os serviços oferecidos pela barbearia"
      itens={MENU_ADMINISTRADOR}
    >
      {!permitido ? (
        <p role="alert">Você não possui permissão para consultar serviços.</p>
      ) : (
        <PainelCatalogo>
          {aviso && (
            <p role="status" className="p-4 text-success">
              {aviso}
            </p>
          )}
          {alterarStatus.isError && (
            <p role="alert" className="p-4 text-danger">
              {alterarStatus.error.message}
            </p>
          )}
          {consulta.data && (
            <IndicadoresServicos dados={consulta.data.indicadores} />
          )}
          <form
            className="filtros-catalogo"
            onSubmit={(evento) => {
              evento.preventDefault();
              if (consulta.isFetching) return;
              if (pagina === 1 && filtrosAplicados.busca === busca && filtrosAplicados.status === status) {
                void consulta.refetch();
              } else {
                void cache.invalidateQueries({ queryKey: ['admin', usuario?.id, 'servicos', busca, status, 1], exact: true, refetchType: 'none' });
                setFiltrosAplicados({ busca, status });
                setPagina(1);
              }
            }}
          >
            <label>
              Buscar serviço
              <input
                className={estiloCampo}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
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
                }}
              >
                <option value="">Todos</option>
                {[
                  ['true', 'Ativo'],
                  ['false', 'Inativo'],
                ].map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>
                    {rotulo}
                  </option>
                ))}
              </select>
            </label>
            <button type="submit" className={estiloBotao} disabled={consulta.isFetching}>
              Buscar
            </button>
            <button
              type="button"
              data-novo-cadastro
              className={`${estiloBotao} bg-primary! text-white sm:ml-auto`}
              onClick={() => {
                gravar.reset();
                setAviso('');
                setEditor({ id: null });
              }}
            >
              Novo serviço
            </button>
          </form>
          {editor && (
            <DialogoAdministrativo
              titulo={editor.id === null ? 'Novo serviço' : 'Editar serviço'}
              pendente={gravar.isPending}
              fechar={() => setEditor(null)}
            >
              {editor.id !== null &&
              (detalhe.isPending || detalhe.isFetching) ? (
                <EstadoCarregamento />
              ) : editor.id !== null && detalhe.isError ? (
                <EstadoErro
                  mensagem={detalhe.error.message}
                  tentarNovamente={() => void detalhe.refetch()}
                />
              ) : (
                <FormularioCadastro
                  key={editor.id ?? 'novo'}
                  schema={schemaServico}
                  campos={[
                    {
                      nome: 'nome',
                      rotulo: 'Nome',
                      obrigatorio: true,
                      tamanhoMinimo: 2,
                      larguraCompleta: true,
                    },
                    {
                      nome: 'duracaoMinutos',
                      rotulo: 'Duração (minutos)',
                      tipo: 'number',
                      obrigatorio: true,
                      minimo: 1,
                      passo: '1',
                    },
                    {
                      nome: 'precoBase',
                      rotulo: 'Preço (R$)',
                      tipo: 'number',
                      obrigatorio: true,
                      minimo: 0.01,
                      passo: '0.01',
                    },
                    {
                      nome: 'descricao',
                      rotulo: 'Descrição (opcional)',
                      tipo: 'textarea',
                    },
                  ]}
                  valores={editor.id === null ? {} : detalhe.data!}
                  pendente={gravar.isPending}
                  erro={gravar.error?.message}
                  salvar={(dados) => gravar.mutateAsync(dados)}
                  fechar={() => setEditor(null)}
                />
              )}
              {editor.id !== null &&
                (detalhe.isPending ||
                  detalhe.isFetching ||
                  detalhe.isError) && (
                  <button
                    className={estiloBotao}
                    onClick={() => setEditor(null)}
                  >
                    Cancelar
                  </button>
                )}
            </DialogoAdministrativo>
          )}
          <ResultadosListagem
            atualizando={consulta.isFetching && !!consulta.data}
            erro={consulta.isError && !!consulta.data}
            tentarNovamente={() => void consulta.refetch()}
          >
            {consulta.isPending && !consulta.data ? (
              <EstadoCarregamento />
            ) : !consulta.data ? (
              <EstadoErro
                mensagem={consulta.error?.message ?? 'Não foi possível carregar os dados.'}
                tentarNovamente={() => void consulta.refetch()}
              />
            ) : (
              <>
                <div className="min-w-0 p-4 pt-0">
                  <CatalogoServicos
                    servicos={consulta.data.data}
                    editar={(id) => {
                      gravar.reset();
                      setAviso('');
                      setEditor({ id });
                    }}
                    pendente={alterarStatus.isPending}
                    idPendente={
                      alterarStatus.isPending
                        ? alterarStatus.variables.id
                        : undefined
                    }
                    alterar={(id, ativo) => {
                      if (!alterarStatus.isPending)
                        alterarStatus.mutate({ id, ativo });
                    }}
                  />
                </div>
                <PaginacaoCatalogo
                  pagina={consulta.data.meta.pagina}
                  bloqueada={consulta.isFetching || consulta.isError || consulta.isPlaceholderData}
                  totalPaginas={consulta.data.meta.totalPaginas}
                  total={consulta.data.meta.total}
                  entidade="serviços"
                  mudar={setPagina}
                />
              </>
            )}
          </ResultadosListagem>
        </PainelCatalogo>
      )}
    </DashboardLayout>
  );
}
