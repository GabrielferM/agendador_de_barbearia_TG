import { semSenha } from '../../../common/utils/resposta';

export const includeAdministrador = { usuario: true } as const;

export const apresentarAdministrador = <T extends { usuario: { senhaHash: string } }>(
  administrador: T,
) => ({
  ...administrador,
  usuario: semSenha(administrador.usuario),
});
