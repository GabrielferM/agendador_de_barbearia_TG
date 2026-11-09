import { Transform } from 'class-transformer';
import { registerDecorator } from 'class-validator';
import { normalizarCpf, normalizarCnpj } from '../utils/documentos';

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
export const Aparar = () =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value));
export const EmailNormalizado = () =>
  Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  );
export const TelefoneNormalizado = () =>
  Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const texto = value.trim();
    return /^(?:\d{10,11}|\(\d{2}\) ?\d{4,5}-?\d{4}|\d{2} ?\d{4,5}-\d{4})$/.test(texto)
      ? texto.replace(/\D/g, '')
      : texto;
  });
export function DocumentoValido(tipo: 'cpf' | 'cnpj') {
  return (alvo: object, propriedade: string) =>
    registerDecorator({
      name: `${tipo}Valido`,
      target: alvo.constructor,
      propertyName: propriedade,
      options: { message: `${tipo.toUpperCase()} inválido.` },
      validator: {
        validate: (valor: unknown) => {
          if (typeof valor !== 'string') return false;
          const padrao =
            tipo === 'cpf'
              ? /^(?:\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/
              : /^(?:\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})$/;
          if (!padrao.test(valor)) return false;
          try {
            (tipo === 'cpf' ? normalizarCpf : normalizarCnpj)(valor);
            return true;
          } catch {
            return false;
          }
        },
      },
    });
}
