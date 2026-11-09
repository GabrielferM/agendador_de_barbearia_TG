import * as yup from 'yup';

export const somenteDigitos = (valor: string) => valor.replace(/\D/g, '');
export const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
];
export function documentoValido(entrada: string, tipo: 'cpf' | 'cnpj') {
  const padrao =
    tipo === 'cpf'
      ? /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/
      : /^(?:\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
  if (!padrao.test(entrada)) return false;
  const valor = somenteDigitos(entrada);
  if (/^(\d)\1+$/.test(valor)) return false;
  const pesos =
    tipo === 'cpf'
      ? [
          [10, 9, 8, 7, 6, 5, 4, 3, 2],
          [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
        ]
      : [
          [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
          [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
        ];
  return pesos.every((lista, indice) => {
    const soma = [...valor.slice(0, -2 + indice)].reduce(
      (total, n, i) => total + Number(n) * lista[i],
      0,
    );
    const resto = soma % 11;
    return Number(valor[valor.length - 2 + indice]) === (resto < 2 ? 0 : 11 - resto);
  });
}
export function mascararCpf(valor: string) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}
export function mascararTelefone(valor: string) {
  return somenteDigitos(valor)
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
}
export function mascararCnpj(valor: string) {
  return somenteDigitos(valor)
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2/$3')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}
export const mascararCep = (valor: string) =>
  somenteDigitos(valor)
    .slice(0, 8)
    .replace(/^(\d{5})(\d)/, '$1-$2');
export function formatarCampo(nome: string, valor: string) {
  if (nome === 'cpf') return mascararCpf(valor);
  if (nome === 'cnpj') return mascararCnpj(valor);
  if (nome === 'telefone') return mascararTelefone(valor);
  if (nome === 'cep') return mascararCep(valor);
  if (nome === 'estado') return valor.toUpperCase();
  return valor;
}
export const textoObrigatorio = (rotulo: string) =>
  yup.string().trim().required(`Informe ${rotulo}.`);
export const nomeSchema = textoObrigatorio('o nome').min(
  2,
  'Informe seu nome com pelo menos 2 caracteres.',
);
export const emailSchema = textoObrigatorio('seu e-mail')
  .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Informe um e-mail válido.')
  .max(254, 'Use até 254 caracteres.');
export const senhaSchema = yup
  .string()
  .required('Informe sua senha.')
  .test(
    'tamanho',
    'Use de 15 a 128 caracteres.',
    (v) => [...v].length >= 15 && [...v].length <= 128,
  );
export const cpfSchema = textoObrigatorio('o CPF').test('cpf', 'Informe um CPF válido.', (v) =>
  documentoValido(v, 'cpf'),
);
export const telefoneSchema = yup
  .string()
  .test(
    'telefone',
    'Informe DDD e telefone com 10 ou 11 dígitos.',
    (v) => !v || /^(?:\d{10,11}|\(\d{2}\) ?\d{4,5}-?\d{4}|\d{2} ?\d{4,5}-\d{4})$/.test(v.trim()),
  );
export const diaValido = (v: string) =>
  /^\d{4}-\d{2}-\d{2}$/.test(v) &&
  Number.isFinite(Date.parse(v)) &&
  new Date(v).toISOString().slice(0, 10) === v;
export const dataSchema = yup
  .string()
  .test('data', 'Informe uma data válida.', (v) => !v || diaValido(v));
export const idSchema = yup
  .string()
  .required('Selecione uma opção.')
  .test(
    'id',
    'Selecione uma opção válida.',
    (v) => /^[1-9]\d*$/.test(v) && Number.isSafeInteger(Number(v)),
  );
export function aniversarioValido(dia: string, mes: string) {
  if (!dia && !mes) return true;
  if (!/^\d{1,2}$/.test(dia) || !/^\d{1,2}$/.test(mes)) return false;
  const d = Number(dia),
    m = Number(mes);
  return (
    m >= 1 && m <= 12 && d >= 1 && d <= [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]
  );
}
export const camposAniversario = Object.fromEntries(
  ['diaAniversario', 'mesAniversario'].map((campo) => [
    campo,
    yup.string().test('aniversario', 'Informe dia e mês de aniversário válidos.', function () {
      return aniversarioValido(this.parent.diaAniversario ?? '', this.parent.mesAniversario ?? '');
    }),
  ]),
);
export const motivoSchema = yup
  .string()
  .trim()
  .required('Informe o motivo do cancelamento.')
  .max(1000, 'Use até 1000 caracteres.');
export function errosSchema(schema: yup.AnyObjectSchema, dados: object): Record<string, string> {
  try {
    schema.validateSync(dados, { abortEarly: false });
    return {};
  } catch (erro) {
    if (!(erro instanceof yup.ValidationError)) throw erro;
    const erros: Record<string, string> = {};
    for (const item of erro.inner)
      if (item.path && !erros[item.path]) erros[item.path] = item.message;
    return erros;
  }
}
export function focarPrimeiroErro(form: HTMLFormElement, erros: Record<string, string>) {
  const campo = Array.from(form.elements).find(
    (elemento) => 'name' in elemento && erros[String(elemento.name)],
  );
  if (campo instanceof HTMLElement) campo.focus();
}
export function serializarAniversario(dados: Record<string, string>) {
  return {
    diaAniversario: dados.diaAniversario ? Number(dados.diaAniversario) : null,
    mesAniversario: dados.mesAniversario ? Number(dados.mesAniversario) : null,
  };
}
