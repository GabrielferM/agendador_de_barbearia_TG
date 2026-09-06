import { SetMetadata } from '@nestjs/common';

export const ROTA_SEM_CSRF = 'rotaSemCsrf';
export const CsrfIsento = () => SetMetadata(ROTA_SEM_CSRF, true);
