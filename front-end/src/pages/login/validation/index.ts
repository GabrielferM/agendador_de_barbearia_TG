import * as yup from 'yup';
import type { CredenciaisLogin } from '../types';
import { emailSchema, errosSchema } from '../../../forms/campos';
export type ErrosFormularioLogin = Partial<Record<keyof CredenciaisLogin, string>>;
export const schemaLogin = yup.object({
  email: emailSchema,
  senha: yup.string().required('Informe sua senha.'),
});
export function validarFormularioLogin(valores: CredenciaisLogin): ErrosFormularioLogin {
  return errosSchema(schemaLogin, valores);
}
