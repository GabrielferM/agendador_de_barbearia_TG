import {
  Body,
  Controller,
  Get,
  Headers,
  Header,
  HttpException,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Post,
  Req,
  Res,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import type { Response } from 'express';
import { Throttle } from '@nestjs/throttler';
import { CsrfIsento } from '../../common/auth/csrf-isento.decorator';
import { Publico } from '../../common/auth/publico.decorator';
import { UsuarioAtual } from '../../common/auth/usuario-atual.decorator';
import type { RequisicaoAutenticada, UsuarioAutenticado } from '../../common/auth/auth.types';
import { CookieService } from '../../common/security/cookie.service';
import { CsrfService } from '../../common/security/csrf.service';
import { AutenticacaoService } from './autenticacao.service';
import { AutenticacaoRespostaDto, LoginDto } from './dto/login.dto';
import { corsOriginFor, EnvironmentVariables } from '../../config/environment';

@ApiTags('Autenticação')
@Controller('auth')
export class AutenticacaoController {
  constructor(
    private readonly service: AutenticacaoService,
    private readonly cookies: CookieService,
    private readonly csrf: CsrfService,
    private readonly config: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @Publico()
  @CsrfIsento()
  @Throttle({ login: { limit: 10, ttl: 60_000 } })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AutenticacaoRespostaDto })
  @ApiUnauthorizedResponse({ description: 'E-mail ou senha inválidos.' })
  @Header('Cache-Control', 'no-store')
  async login(
    @Body() dto: LoginDto,
    @Headers('content-type') contentType: string | undefined,
    @Headers('origin') origin: string | undefined,
    @Res({ passthrough: true }) response: Response,
  ) {
    if (!contentType?.toLowerCase().startsWith('application/json')) {
      throw new UnsupportedMediaTypeException('O login aceita somente application/json.');
    }
    this.validarOrigem(origin);
    let resultado: Awaited<ReturnType<AutenticacaoService['login']>>;
    try {
      resultado = await this.service.login(dto);
    } catch (erro) {
      if (erro instanceof HttpException && erro.getStatus() === 429) {
        const corpo = erro.getResponse();
        if (corpo && typeof corpo === 'object' && 'retryAfter' in corpo) {
          response.setHeader('Retry-After', String(corpo.retryAfter));
        }
      }
      throw erro;
    }
    this.cookies.definir(response, resultado.token, this.csrf.criar(resultado.sessaoId));
    return { usuario: resultado.usuario };
  }

  @Get('me')
  @ApiCookieAuth('sessao')
  @ApiOkResponse({ type: AutenticacaoRespostaDto })
  @Header('Cache-Control', 'no-store')
  me(@UsuarioAtual() usuario: UsuarioAutenticado) {
    return this.service.me(usuario);
  }

  @Get('csrf')
  @ApiOperation({ summary: 'Renova o token CSRF da sessão atual' })
  @Header('Cache-Control', 'no-store')
  csrfToken(
    @UsuarioAtual() usuario: UsuarioAutenticado,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.csrf.criar(usuario.sessaoId);
    this.cookies.definirCsrf(response, token);
    return { csrfToken: token };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Header('Cache-Control', 'no-store')
  async logout(
    @Req() request: RequisicaoAutenticada,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = request.cookies?.[this.cookies.nomeSessao] as string | undefined;
    if (token) await this.service.logout(token);
    this.cookies.limpar(response);
    return { mensagem: 'Sessão encerrada.' };
  }

  private validarOrigem(origin: string | undefined) {
    const environment: EnvironmentVariables = {
      DATABASE_URL: this.config.getOrThrow('DATABASE_URL'),
      PORT: this.config.getOrThrow('PORT'),
      NODE_ENV: this.config.getOrThrow('NODE_ENV'),
      CORS_ORIGINS: this.config.getOrThrow('CORS_ORIGINS'),
      CSRF_SECRET: this.config.getOrThrow('CSRF_SECRET'),
    };
    const permitidas = corsOriginFor(environment);
    if (!origin && environment.NODE_ENV !== 'production') return;
    const valida =
      origin &&
      (permitidas instanceof RegExp ? permitidas.test(origin) : permitidas.includes(origin));
    if (!valida) throw new ForbiddenException('Origem da requisição não permitida.');
  }
}
