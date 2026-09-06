import { SetMetadata } from '@nestjs/common';

export const PERMISSOES_EXIGIDAS = 'permissoesExigidas';
export const ExigirPermissoes = (...permissoes: string[]) =>
  SetMetadata(PERMISSOES_EXIGIDAS, permissoes);
