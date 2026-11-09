import * as yup from 'yup';
import {
  camposAniversario,
  cpfSchema,
  emailSchema,
  nomeSchema,
  senhaSchema,
  telefoneSchema,
} from '../../forms/campos';
export function schemaConta(modo: 'cadastro' | 'recuperar' | 'redefinir') {
  return yup.object({
    ...(modo !== 'redefinir' ? { email: emailSchema } : {}),
    ...(modo === 'cadastro'
      ? {
          nome: nomeSchema.max(120, 'Use até 120 caracteres.'),
          cpf: cpfSchema,
          telefone: telefoneSchema,
          ...camposAniversario,
        }
      : {}),
    ...(modo !== 'recuperar'
      ? {
          senha: senhaSchema,
          confirmacao: yup
            .string()
            .oneOf([yup.ref('senha')], 'As senhas devem ser iguais.')
            .required('Confirme sua senha.'),
        }
      : {}),
  });
}
