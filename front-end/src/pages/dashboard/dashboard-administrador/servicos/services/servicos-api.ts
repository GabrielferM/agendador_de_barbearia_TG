import { servicosDashboardControllerObter } from '../../../../../api/dashboard-administrativo-serviços/dashboard-administrativo-serviços';
import {
  servicoControllerAtualizar,
  servicoControllerCriar,
  servicoControllerBuscar,
} from '../../../../../api/serviços/serviços';
import { ErroOperacao } from '../../../../../api/operacao-http';
import {
  executarHttp,
  lista,
  registro,
  numero,
  texto,
} from '../../services/administracao-api';

export async function alterarStatusServico(id: number, ativo: boolean) {
  const dados = await executarHttp(() =>
    servicoControllerAtualizar(id, { ativo }),
  ).catch((erro: unknown) => {
    if (erro instanceof ErroOperacao) throw erro;
    throw new Error(
      'Não foi possível confirmar a alteração. Atualize a lista antes de tentar novamente.',
    );
  });
  const resposta = registro(dados);
  if (resposta.id !== id || resposta.ativo !== ativo)
    throw new Error(
      'Não foi possível confirmar o status do serviço. Atualize a lista antes de tentar novamente.',
    );
}

export async function consultarServicos(
  busca: string,
  status: string,
  pagina: number,
  signal?: AbortSignal,
) {
  const obj = registro(
    await executarHttp(() =>
      servicosDashboardControllerObter(
        {
          busca,
          ativo: status ? (status as 'true' | 'false') : undefined,
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
    if (typeof i.ativo !== 'boolean')
      throw new Error('Status do serviço inválido.');
    return {
      id: numero(i.id),
      nome: texto(i.nome),
      duracaoMinutos: numero(i.duracaoMinutos),
      preco: numero(i.preco),
      ativo: i.ativo as boolean,
      realizadosMes: numero(i.realizadosMes),
      receitaMes: numero(i.receitaMes),
    };
  });
  return {
    ...dados,
    geradoEm,
    indicadores: {
      ativos: numero(indicadores.ativos),
      maisRealizado:
        indicadores.maisRealizado === null
          ? null
          : texto(indicadores.maisRealizado),
      ticketMedio: numero(indicadores.ticketMedio),
    },
  };
}

export async function buscarServico(id: number, signal?: AbortSignal) {
  const s = registro(
    await executarHttp(() => servicoControllerBuscar(id, { signal })),
  );
  if (
    numero(s.id) !== id ||
    !Number.isFinite(Number(s.precoBase)) ||
    Number(s.precoBase) <= 0
  )
    throw new Error('Serviço inválido.');
  return {
    nome: texto(s.nome),
    descricao: s.descricao == null ? '' : texto(s.descricao),
    duracaoMinutos: String(numero(s.duracaoMinutos)),
    precoBase: String(s.precoBase),
  };
}

export async function salvarServico(
  id: number | null,
  dados: Record<string, string>,
) {
  const payload = {
    nome: dados.nome.trim(),
    descricao: dados.descricao.trim(),
    duracaoMinutos: Number(dados.duracaoMinutos),
    precoBase: Number(dados.precoBase),
  };
  const resposta = registro(
    await executarHttp(
      () =>
        id === null
          ? servicoControllerCriar(payload)
          : servicoControllerAtualizar(id, payload),
      id === null ? 201 : 200,
    ),
  );
  const retornoId = numero(resposta.id);
  if (
    retornoId <= 0 ||
    (id !== null && retornoId !== id) ||
    resposta.nome !== payload.nome ||
    Number(resposta.precoBase) !== payload.precoBase ||
    resposta.duracaoMinutos !== payload.duracaoMinutos
  ) {
    throw new Error(
      'Não foi possível confirmar o serviço salvo. Atualize a lista antes de repetir.',
    );
  }
}
