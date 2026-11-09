import * as yup from 'yup';
import {
  camposAniversario,
  cpfSchema,
  dataSchema,
  documentoValido,
  emailSchema,
  idSchema,
  nomeSchema,
  senhaSchema,
  telefoneSchema,
  textoObrigatorio,
  UFS,
} from '../../../../forms/campos';

export const schemaCliente = (edicao: boolean) =>
  yup.object({
    nome: nomeSchema,
    email: emailSchema,
    cpf: cpfSchema,
    telefone: telefoneSchema,
    ...camposAniversario,
    observacao: yup.string(),
    senha: edicao
      ? yup
          .string()
          .test(
            'senha-opcional',
            'Use de 15 a 128 caracteres.',
            (v) => !v || senhaSchema.isValidSync(v),
          )
      : senhaSchema,
    ...(edicao
      ? {
          status: yup
            .string()
            .required('Selecione o status.')
            .oneOf(
              ['ATIVO', 'INATIVO', 'BLOQUEADO'],
              'Selecione um status válido.',
            ),
        }
      : {}),
  });
export const schemaBarbeiro = (ids: string[], edicao = false) =>
  yup.object({
    nome: nomeSchema,
    email: emailSchema,
    senha: edicao
      ? yup
          .string()
          .test(
            'senha-opcional',
            'Use de 15 a 128 caracteres.',
            (v) => !v || senhaSchema.isValidSync(v),
          )
      : senhaSchema,
    ...(edicao
      ? {
          statusProfissional: yup
            .string()
            .required('Selecione o status profissional.')
            .oneOf(['ATIVO', 'INATIVO', 'AFASTADO']),
        }
      : {}),
    idFilial: idSchema.oneOf(ids, 'Selecione uma filial disponível.'),
    nomeProfissional: yup.string().trim(),
    descricao: yup.string().trim(),
    fotoUrl: yup
      .string()
      .trim()
      .url('Informe uma URL válida.')
      .test(
        'http',
        'Use uma URL http ou https.',
        (v) => !v || /^https?:\/\//i.test(v),
      ),
    dataAdmissao: dataSchema,
  });
export const schemaFilial = (edicao: boolean) =>
  yup.object({
    nome: textoObrigatorio('o nome'),
    cnpj: textoObrigatorio('o CNPJ').test(
      'cnpj',
      'Informe um CNPJ válido.',
      (v) => documentoValido(v, 'cnpj'),
    ),
    telefone: telefoneSchema,
    email: yup
      .string()
      .trim()
      .test(
        'email',
        'Informe um e-mail válido.',
        (v) => !v || emailSchema.isValidSync(v),
      ),
    cep: textoObrigatorio('o CEP').matches(
      /^\d{5}-?\d{3}$/,
      'Informe um CEP com oito dígitos.',
    ),
    logradouro: textoObrigatorio('o logradouro'),
    numero: textoObrigatorio('o número'),
    complemento: yup.string().trim(),
    bairro: textoObrigatorio('o bairro'),
    cidade: textoObrigatorio('a cidade'),
    estado: textoObrigatorio('a UF')
      .uppercase()
      .oneOf(UFS, 'Selecione uma UF válida.'),
    ...(edicao
      ? {
          status: yup
            .string()
            .required('Selecione o status.')
            .oneOf(
              ['ATIVA', 'INATIVA', 'EM_MANUTENCAO'],
              'Selecione um status válido.',
            ),
        }
      : {}),
  });

export const schemaServico = yup.object({
  nome: nomeSchema,
  descricao: yup.string().trim(),
  duracaoMinutos: yup
    .number()
    .typeError('Informe a duração em minutos.')
    .required('Informe a duração.')
    .integer('Use minutos inteiros.')
    .positive('A duração deve ser maior que zero.'),
  precoBase: yup
    .number()
    .typeError('Informe o preço.')
    .required('Informe o preço.')
    .positive('O preço deve ser maior que zero.')
    .test(
      'centavos',
      'Use até duas casas decimais.',
      (v) => v == null || Math.abs(v * 100 - Math.round(v * 100)) < 1e-8,
    ),
});
