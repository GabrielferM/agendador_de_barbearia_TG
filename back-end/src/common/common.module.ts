import { Module } from '@nestjs/common';
import { SenhaService } from './security/senha.service';
import { CookieService } from './security/cookie.service';
import { CsrfService } from './security/csrf.service';

@Module({
  providers: [SenhaService, CookieService, CsrfService],
  exports: [SenhaService, CookieService, CsrfService],
})
export class CommonModule {}
