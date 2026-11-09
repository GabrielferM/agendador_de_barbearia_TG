import { useConsultaListagem } from '../../components/use-consulta-listagem';
import { ResultadosListagem } from '../../components/resultados-listagem';
import { DialogoAdministrativo } from '../components/dialogo-administrativo';
import { schemaBarbeiro } from '../components/schemas-cadastro';
import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAutenticacao } from '../../../../auth/contexto-autenticacao';
import {
  DashboardLayout,
  EstadoCarregamento,
  EstadoErro,
} from '../../components/dashboard-compartilhado';
import { MENU_ADMINISTRADOR } from '../constants/menu-administrador';
import {
  FormularioCadastro,
  estiloBotao,
  estiloCampo,
} from '../components/formulario-cadastro';
import type { CampoCadastro } from '../components/formulario-cadastro';
import {
  IndicadoresBarbeiros,
  CartoesBarbeiros,
} from './components/components';
import {
  consultarBarbeiros,
  consultarFiliaisCadastro,
  criarBarbeiro,
  buscarBarbeiro,
  editarBarbeiro,
  alterarStatusConta,
} from './services/barbeiros-api';

import {
  PainelCatalogo,
  PaginacaoCatalogo,
} from '../components/painel-catalogo';

export function BarbeirosAdministrador() {
  const { usuario } = useAutenticacao();
  const cache = useQueryClient();
  const permitido = !!usuario?.permissoes.includes('GERENCIAR_USUARIOS');
  const [busca, setBusca] = useState('');
  const [status, setStatus] = useState('');
  const [pagina, setPagina] = useState(1);
  const [filtrosAplicados, setFiltrosAplicados] = useState({ busca: '', status: '' });
  const [editor, setEditor] = useState<{ id: number | null } | null>(null);
  const [conta, setConta] = useState<{
    id: number;
    nome: string;
    statusConta: 'ATIVO' | 'INATIVO';
  } | null>(null);
  const contaOcupada = useRef(false);
  const [aviso, setAviso] = useState('');
  const filiais = useQuery({
    queryKey: ['admin', usuario?.id, 'filiais-cadastro-barbeiro'],
    enabled: permitido && !!editor,
    queryFn: ({ signal }) => consultarFiliaisCadastro(signal),
  });
  const gravar = useMutation({
    mutationFn: (dados: Record<string, string>) =>
      editor?.id != null
        ? editarBarbeiro(editor.id, dados)
        : criarBarbeiro(dados),
    retry: false,
    onSuccess: async () => {
      setEditor(null);
      setAviso(
        editor?.id != null
          ? 'Barbeiro atualizado.'
          : 'Conta de barbeiro criada. O acesso já pode ser feito com o e-mail e a senha cadastrados.',
      );
      await cache.invalidateQueries({ queryKey: ['admin', usuario?.id] });
      await cache.invalidateQueries({ queryKey: ['inicio', 'barbeiros'] });
      await cache.invalidateQueries({ queryKey: ['agendar'] });
    },
  });
  const detalhe = useQuery({
    queryKey: ['admin', usuario?.id, 'barbeiro', editor?.id],
    enabled: permitido && editor?.id != null,
    queryFn: ({ signal }) => buscarBarbeiro(editor!.id!, signal),
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const opcoesFiliais = [...(filiais.data ?? [])];
  if (
    editor?.id != null &&
    detalhe.data &&
    !opcoesFiliais.some((f) => f.id === detalhe.data.filial.id)
  )
    opcoesFiliais.push(detalhe.data.filial);
  const mudarConta = useMutation({
    mutationFn: (c: NonNullable<typeof conta>) =>
      alterarStatusConta(c.id, c.statusConta),
    retry: false,
    onSettled: () => {
      contaOcupada.current = false;
    },
    onSuccess: async () => {
      setAviso(
        conta?.statusConta === 'ATIVO'
          ? 'Conta reativada.'
          : 'Conta inativada. Agendamentos existentes foram preservados.',
      );
      setConta(null);
      await Promise.all([
        cache.invalidateQueries({ queryKey: ['admin', usuario?.id] }),
        cache.invalidateQueries({ queryKey: ['inicio', 'barbeiros'] }),
        cache.invalidateQueries({ queryKey: ['agendar'] }),
      ]);
    },
  });
  const campos: CampoCadastro[] = [
    { nome: 'nome', rotulo: 'Nome', obrigatorio: true, tamanhoMinimo: 2 },
    { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true },
    {
      nome: 'senha',
      rotulo:
        editor?.id != null
          ? 'Nova senha (opcional)'
          : 'Senha (15 a 128 caracteres)',
      tipo: 'password',
      obrigatorio: editor?.id === null,
      tamanhoMinimo: 15,
    },
    {
      nome: 'idFilial',
      rotulo: 'Filial',
      obrigatorio: true,
      opcoes: opcoesFiliais.map((f) => ({
        valor: String(f.id),
        rotulo: f.nome,
      })),
    },
    { nome: 'nomeProfissional', rotulo: 'Nome profissional (opcional)' },
    { nome: 'descricao', rotulo: 'Descrição (opcional)', tipo: 'textarea' },
    {
      nome: 'fotoUrl',
      rotulo: 'URL da foto (opcional)',
      tipo: 'url',
      descricao:
        editor?.id != null ? 'Vazio preserva a foto atual.' : undefined,
    },
    {
      nome: 'dataAdmissao',
      rotulo: 'Data de admissão (opcional)',
      tipo: 'date',
      descricao:
        editor?.id != null ? 'Vazio preserva a data atual.' : undefined,
    },
    ...(editor?.id != null
      ? [
          {
            nome: 'statusProfissional',
            rotulo: 'Status profissional',
            obrigatorio: true,
            opcoes: ['ATIVO', 'INATIVO', 'AFASTADO'].map((valor) => ({
              valor,
              rotulo: valor,
            })),
          },
        ]
      : []),
  ];
  const consulta = useConsultaListagem({
    queryKey: ['admin', usuario?.id, 'barbeiros', filtrosAplicados.busca, filtrosAplicados.status, pagina],
    enabled: permitido,
    queryFn: ({ signal }) => consultarBarbeiros(filtrosAplicados.busca, filtrosAplicados.status, pagina, signal),
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
          {consulta.data && (
            <IndicadoresBarbeiros dados={consulta.data.indicadores} />
          )}
          <form
            className="filtros-catalogo"
            onSubmit={(evento) => {
              evento.preventDefault();
              if (consulta.isFetching) return;
              if (pagina === 1 && filtrosAplicados.busca === busca && filtrosAplicados.status === status) {
                void consulta.refetch();
              } else {
                void cache.invalidateQueries({ queryKey: ['admin', usuario?.id, 'barbeiros', busca, status, 1], exact: true, refetchType: 'none' });
                setFiltrosAplicados({ busca, status });
                setPagina(1);
              }
            }}
          >
            <label>
              Buscar barbeiro
              <input
                className={estiloCampo}
                value={busca}
                onChange={(e) => {
                  setBusca(e.target.value);
                }}
              />
            </label>
            <label>
              Status profissional
              <select
                className={estiloCampo}
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                }}
              >
                <option value="">Todos</option>
                {[
                  ['ATIVO', 'Ativo'],
                  ['INATIVO', 'Inativo'],
                  ['AFASTADO', 'Afastado'],
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
              className={`${estiloBotao} bg-primary! text-white sm:ml-auto`}
              data-novo-cadastro
              disabled={!!editor}
              onClick={() => {
                gravar.reset();
                setAviso('');
                setEditor({ id: null });
              }}
            >
              Novo barbeiro
            </button>
          </form>
          {aviso && (
            <p role="status" className="px-4 pb-4">
              {aviso}
            </p>
          )}
          {editor && (
            <DialogoAdministrativo
              titulo={editor.id === null ? 'Novo barbeiro' : 'Editar barbeiro'}
              pendente={gravar.isPending}
              fechar={() => setEditor(null)}
            >
              {filiais.isPending ||
              (editor.id !== null &&
                (detalhe.isPending || detalhe.isFetching)) ? (
                <EstadoCarregamento />
              ) : filiais.isError || (editor.id !== null && detalhe.isError) ? (
                <EstadoErro
                  mensagem={(filiais.error ?? detalhe.error)!.message}
                  tentarNovamente={() => {
                    void filiais.refetch();
                    if (editor.id !== null) void detalhe.refetch();
                  }}
                />
              ) : !opcoesFiliais.length ? (
                <p role="status">
                  Nenhuma filial ativa disponível. Cadastre ou ative uma filial
                  antes de criar a conta.
                </p>
              ) : (
                <FormularioCadastro
                  key={editor.id ?? 'novo'}
                  schema={schemaBarbeiro(
                    opcoesFiliais.map((f) => String(f.id)),
                    editor.id !== null,
                  )}
                  campos={campos}
                  valores={
                    editor.id === null
                      ? {
                          idFilial:
                            opcoesFiliais.length === 1
                              ? String(opcoesFiliais[0].id)
                              : '',
                        }
                      : detalhe.data!.dados
                  }
                  pendente={gravar.isPending}
                  erro={gravar.error?.message}
                  salvar={(dados) => gravar.mutateAsync(dados)}
                  fechar={() => setEditor(null)}
                />
              )}
              {(filiais.isPending ||
                filiais.isError ||
                !opcoesFiliais.length ||
                (editor.id !== null &&
                  (detalhe.isPending ||
                    detalhe.isFetching ||
                    detalhe.isError))) && (
                <button className={estiloBotao} onClick={() => setEditor(null)}>
                  Cancelar
                </button>
              )}
            </DialogoAdministrativo>
          )}
          {conta && (
            <DialogoAdministrativo
              titulo={`${conta.statusConta === 'ATIVO' ? 'Reativar' : 'Inativar'} conta de ${conta.nome}?`}
              pendente={mudarConta.isPending}
              fechar={() => setConta(null)}
            >
              <p className="mb-4">
                A alteração afeta o acesso da conta. O status profissional e os
                agendamentos existentes serão preservados.
              </p>
              {mudarConta.error && (
                <p role="alert" className="text-danger">
                  {mudarConta.error.message}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  autoFocus
                  className={estiloBotao}
                  disabled={mudarConta.isPending}
                  onClick={() => setConta(null)}
                >
                  Cancelar
                </button>
                <button
                  className={estiloBotao}
                  disabled={mudarConta.isPending}
                  onClick={() => {
                    if (!contaOcupada.current) {
                      contaOcupada.current = true;
                      mudarConta.mutate(conta);
                    }
                  }}
                >
                  {mudarConta.isPending ? 'Salvando…' : 'Confirmar alteração'}
                </button>
              </div>
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
                  <CartoesBarbeiros
                    barbeiros={consulta.data.data}
                    editar={(id) => {
                      gravar.reset();
                      setAviso('');
                      setEditor({ id });
                    }}
                    alterarConta={(b) => {
                      mudarConta.reset();
                      setAviso('');
                      setConta({
                        id: b.id,
                        nome: b.nome,
                        statusConta:
                          b.statusConta === 'ATIVO' ? 'INATIVO' : 'ATIVO',
                      });
                    }}
                  />
                </div>
                <PaginacaoCatalogo
                  pagina={consulta.data.meta.pagina}
                  bloqueada={consulta.isFetching || consulta.isError || consulta.isPlaceholderData}
                  totalPaginas={consulta.data.meta.totalPaginas}
                  total={consulta.data.meta.total}
                  entidade="barbeiros"
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
