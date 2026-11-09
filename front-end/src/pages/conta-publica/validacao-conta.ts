import { documentoValido } from '../../forms/campos';
export { mascararCpf, mascararTelefone } from '../../forms/campos';
export const validarCpf = (entrada: string) => documentoValido(entrada, 'cpf');
