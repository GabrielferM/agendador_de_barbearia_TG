import { barbeiroDashboardControllerObter } from '../../../../../api/dashboard-administrativo-barbeiros/dashboard-administrativo-barbeiros';
import {
  barbeiroControllerCriar,
  barbeiroControllerBuscar,
  barbeiroControllerAtualizar,
} from '../../../../../api/barbeiros/barbeiros';
import { catalogoPublicoControllerFiliais } from '../../../../../api/catálogo-público/catálogo-público';
import {
  executarHttp,
  lista,
  registro,
  numero,
  texto,
} from '../../services/administracao-api';

export async function consultarFiliaisCadastro(signal?: AbortSignal) {
  const filiais: { id: number; nome: string }[] = [];
  let pagina = 1;
  let totalPaginas: number;
  do {
    const resposta = lista(
      await executarHttp(() =>
        catalogoPublicoControllerFiliais({ pagina, limite: 100 }, { signal }),
      ),
      (item) => {
        const filial = registro(item);
        return { id: numero(filial.id), nome: texto(filial.nome) };
      },
    );
    filiais.push(...resposta.data);
    totalPaginas = resposta.meta.totalPaginas;
    pagina++;
  } while (pagina <= totalPaginas);
  return filiais;
}

export async function criarBarbeiro(dados: Record<string, string>) {
  const idFilial = Number(dados.idFilial);
  if (!Number.isInteger(idFilial) || idFilial <= 0)
    throw new Error('Selecione uma filial.');
  const resposta = registro(
    await executarHttp(
      () =>
        barbeiroControllerCriar({
          nome: dados.nome.trim(),
          email: dados.email.trim().toLowerCase(),
          senha: dados.senha,
          idFilial,
          nomeProfissional: dados.nomeProfissional || undefined,
          descricao: dados.descricao || undefined,
          fotoUrl: dados.fotoUrl || undefined,
          dataAdmissao: dados.dataAdmissao || undefined,
        }),
      201,
    ),
  );
  const id = numero(resposta.id),
    usuario = registro(resposta.usuario);
  if (
    !Number.isInteger(id) ||
    id <= 0 ||
    numero(usuario.id) !== id ||
    usuario.status !== 'ATIVO'
  ) {
    throw new Error(
      'Não foi possível confirmar a conta criada. Atualize a lista antes de repetir.',
    );
  }
}

export async function consultarBarbeiros(
  busca: string,
  status: string,
  pagina: number,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      barbeiroDashboardControllerObter(
        {
          busca,
          status: status
            ? (status as 'ATIVO' | 'INATIVO' | 'AFASTADO')
            : undefined,
          pagina,
          limite: 12,
        },
        { signal },
      ),
    ),
  );
  const indicadores = registro(obj.indicadores);
  const geradoEm = texto(obj.geradoEm);
  if (!Number.isFinite(Date.parse(geradoEm)))
    throw new Error('Data de atualização inválida.');
  const dados = lista(obj, (item) => {
    const i = registro(item);
    if (!['ATIVO', 'INATIVO', 'AFASTADO'].includes(String(i.status)))
      throw new Error('Status profissional inválido.');
    if (!['ATIVO', 'INATIVO', 'BLOQUEADO'].includes(String(i.statusConta)))
      throw new Error('Status da conta inválido.');
    return {
      statusConta: texto(i.statusConta),
      id: numero(i.id),
      nome: texto(i.nome),
      filial: texto(i.filial),
      status: texto(i.status),
      atendimentosHoje: numero(i.atendimentosHoje),
      receitaMes: numero(i.receitaMes),
      comissoesRegistradasMes: numero(i.comissoesRegistradasMes),
      comissoesAPagar: numero(i.comissoesAPagar),
    };
  });
  return {
    ...dados,
    geradoEm,
    indicadores: {
      ativos: numero(indicadores.ativos),
      atendimentosMes: numero(indicadores.atendimentosMes),
      comissoesAPagar: numero(indicadores.comissoesAPagar),
    },
  };
}

export async function buscarBarbeiro(id: number, signal?: AbortSignal) {
  const b = registro(
    await executarHttp(() => barbeiroControllerBuscar(id, { signal })),
  );
  const u = registro(b.usuario),
    f = registro(b.filial);
  if (numero(b.id) !== id || numero(u.id) !== id)
    throw new Error('Conta de barbeiro inválida.');
  const dados: Record<string, string> = {
    nome: texto(u.nome),
    email: texto(u.email),
    senha: '',
    idFilial: String(numero(b.idFilial)),
    statusProfissional: texto(b.statusProfissional),
  };
  if (!['ATIVO', 'INATIVO', 'AFASTADO'].includes(dados.statusProfissional))
    throw new Error('Status profissional inválido.');
  for (const campo of [
    'nomeProfissional',
    'descricao',
    'fotoUrl',
    'dataAdmissao',
  ]) {
    dados[campo] = b[campo] == null ? '' : texto(b[campo]);
  }
  dados.dataAdmissao = dados.dataAdmissao.slice(0, 10);
  return { dados, filial: { id: numero(b.idFilial), nome: texto(f.nome) } };
}

export async function editarBarbeiro(
  id: number,
  dados: Record<string, string>,
) {
  const b = registro(
    await executarHttp(() =>
      barbeiroControllerAtualizar(id, {
        nome: dados.nome.trim(),
        email: dados.email.trim().toLowerCase(),
        senha: dados.senha || undefined,
        idFilial: Number(dados.idFilial),
        nomeProfissional: dados.nomeProfissional,
        descricao: dados.descricao,
        fotoUrl: dados.fotoUrl || undefined,
        dataAdmissao: dados.dataAdmissao || undefined,
        statusProfissional: dados.statusProfissional as
          'ATIVO' | 'INATIVO' | 'AFASTADO',
      }),
    ),
  );
  if (numero(b.id) !== id || numero(registro(b.usuario).id) !== id)
    throw new Error(
      'Não foi possível confirmar a edição. Atualize a lista antes de repetir.',
    );
}

export async function alterarStatusConta(
  id: number,
  statusConta: 'ATIVO' | 'INATIVO',
) {
  const b = registro(
    await executarHttp(() => barbeiroControllerAtualizar(id, { statusConta })),
  );
  const u = registro(b.usuario);
  if (numero(b.id) !== id || numero(u.id) !== id || u.status !== statusConta) {
    throw new Error(
      'Não foi possível confirmar o status da conta. Atualize a lista antes de repetir.',
    );
  }
}
