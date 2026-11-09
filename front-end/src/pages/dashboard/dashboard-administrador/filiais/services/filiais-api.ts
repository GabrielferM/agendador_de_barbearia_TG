import { schemaFilial } from '../../components/schemas-cadastro';
import { somenteDigitos } from '../../../../../forms/campos';
import {
  filialControllerAtualizar,
  filialControllerBuscar,
  filialControllerCriar,
  filialControllerListar,
} from '../../../../../api/filiais/filiais';
import type { AtualizarFilialDto, DadosEnderecoDto } from '../../../../../api/models';
import { ErroOperacao } from '../../../../../api/operacao-http';
import { executarHttp, lista, numero, registro, texto } from '../../services/administracao-api';

export const STATUS_FILIAIS = {
  ATIVA: 'Ativa',
  INATIVA: 'Inativa',
  EM_MANUTENCAO: 'Em manutenção',
} as const;
export type StatusFilial = NonNullable<AtualizarFilialDto['status']>;

const opcional = (valor: unknown) => (valor === null ? null : texto(valor));

function validarFilial(valor: unknown) {
  const filial = registro(valor),
    endereco = registro(filial.endereco);
  if (typeof filial.status !== 'string' || !Object.hasOwn(STATUS_FILIAIS, filial.status))
    throw new Error('Status de filial inválido.');
  const id = numero(filial.id);
  if (!Number.isInteger(id) || id <= 0) throw new Error('Identificador de filial inválido.');
  return {
    id,
    nome: texto(filial.nome),
    cnpj: texto(filial.cnpj),
    telefone: opcional(filial.telefone),
    email: opcional(filial.email),
    status: filial.status as StatusFilial,
    endereco: {
      cep: texto(endereco.cep),
      logradouro: texto(endereco.logradouro),
      numero: texto(endereco.numero),
      complemento: opcional(endereco.complemento),
      bairro: texto(endereco.bairro),
      cidade: texto(endereco.cidade),
      estado: texto(endereco.estado),
    },
  };
}
export type Filial = ReturnType<typeof validarFilial>;

export async function consultarFiliais(
  status: StatusFilial | '',
  pagina: number,
  signal?: AbortSignal,
) {
  return lista(
    await executarHttp(() =>
      filialControllerListar({ status: status || undefined, pagina, limite: 12 }, { signal }),
    ),
    validarFilial,
  );
}

export async function buscarFilial(id: number, signal?: AbortSignal) {
  const filial = validarFilial(await executarHttp(() => filialControllerBuscar(id, { signal })));
  if (filial.id !== id) throw new Error('Filial retornada não corresponde ao cadastro solicitado.');
  return filial;
}

export function valoresFilial(filial: Filial): Record<string, string> {
  return {
    nome: filial.nome,
    cnpj: filial.cnpj,
    telefone: filial.telefone ?? '',
    email: filial.email ?? '',
    status: filial.status,
    ...filial.endereco,
    complemento: filial.endereco.complemento ?? '',
  };
}

export async function salvarFilial(id: number | null, dados: Record<string, string>) {
  const valores = schemaFilial(id !== null).validateSync(dados, {
    abortEarly: false,
    stripUnknown: true,
  }) as Record<string, string>;
  const endereco: DadosEnderecoDto = {
    cep: somenteDigitos(valores.cep),
    logradouro: valores.logradouro,
    numero: valores.numero,
    bairro: valores.bairro,
    cidade: valores.cidade,
    estado: valores.estado.toUpperCase() as DadosEnderecoDto['estado'],
  };
  try {
    const resposta =
      id === null
        ? await executarHttp(
            () =>
              filialControllerCriar({
                nome: valores.nome,
                cnpj: somenteDigitos(valores.cnpj),
                telefone: valores.telefone ? somenteDigitos(valores.telefone) : undefined,
                email: valores.email?.toLowerCase() || undefined,
                endereco: {
                  ...endereco,
                  complemento: valores.complemento || undefined,
                },
              }),
            201,
          )
        : await executarHttp(() =>
            filialControllerAtualizar(id, {
              nome: valores.nome,
              cnpj: somenteDigitos(valores.cnpj),
              telefone: valores.telefone ? somenteDigitos(valores.telefone) : null,
              email: valores.email?.toLowerCase() || null,
              status: valores.status as StatusFilial,
              endereco: {
                ...endereco,
                complemento: valores.complemento || null,
              },
            }),
          );
    const filial = validarFilial(resposta);
    if (
      (id !== null && filial.id !== id) ||
      filial.status !== (id === null ? 'ATIVA' : valores.status)
    )
      throw new Error('Resposta de gravação inválida.');
    return filial;
  } catch (erro) {
    if (erro instanceof ErroOperacao) {
      if (erro.status === 409) throw new ErroOperacao(409, 'Já existe uma filial com esse CNPJ.');
      throw erro;
    }
    throw new Error(
      'Não foi possível confirmar a gravação. Consulte a lista antes de tentar novamente.',
      { cause: erro },
    );
  }
}
