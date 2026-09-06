import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { configurarSwagger } from './../src/config/swagger';
import { SenhaService } from './../src/common/security/senha.service';

interface OpenApiDocument {
  paths: Record<string, unknown>;
  tags: Array<{ name: string }>;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const originalEnvironment = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    CSRF_SECRET: process.env.CSRF_SECRET,
  };
  const prisma = {
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
    usuario: { findUnique: jest.fn(), update: jest.fn() },
    sessao: {
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };
  let sessaoAtual: Record<string, unknown> | null;

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/barbearia_test';
    process.env.NODE_ENV = 'test';
    delete process.env.CORS_ORIGINS;
    process.env.CSRF_SECRET = 'segredo-de-testes-e2e-com-mais-de-32-caracteres';
    prisma.$queryRaw.mockReset().mockResolvedValue([{ result: 1 }]);
    sessaoAtual = null;
    const senhaHash = await new SenhaService().gerarHash('senha correta de teste');
    const usuario = {
      id: 1,
      nome: 'Cliente Teste',
      email: 'cliente@teste.local',
      senhaHash,
      status: 'ATIVO',
      cliente: { id: 1 },
      barbeiro: null,
      papel: {
        codigo: 'CLIENTE',
        ativo: true,
        permissoes: [{ ativo: true, permissao: { ativo: true, codigo: 'CRIAR_AGENDAMENTO' } }],
      },
    };
    prisma.usuario.findUnique.mockReset().mockResolvedValue(usuario);
    prisma.usuario.update.mockReset().mockResolvedValue(usuario);
    prisma.sessao.create.mockReset().mockImplementation(({ data }: { data: object }) => {
      sessaoAtual = {
        id: 'sessao-e2e',
        dataCriacao: new Date(),
        ultimoUso: new Date(),
        dataRevogacao: null,
        usuario,
        ...data,
      };
      return sessaoAtual;
    });
    prisma.sessao.findUnique.mockReset().mockImplementation(() => sessaoAtual);
    prisma.sessao.update.mockReset().mockResolvedValue({});
    prisma.sessao.updateMany.mockReset().mockImplementation(() => {
      if (sessaoAtual) sessaoAtual.dataRevogacao = new Date();
      return { count: sessaoAtual ? 1 : 0 };
    });
    prisma.$transaction
      .mockReset()
      .mockImplementation((operation: unknown) =>
        typeof operation === 'function'
          ? (operation as (tx: typeof prisma) => unknown)(prisma)
          : Promise.all(operation as Promise<unknown>[]),
      );

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    configurarSwagger(app, {
      DATABASE_URL: process.env.DATABASE_URL,
      PORT: 3000,
      NODE_ENV: 'test',
      CORS_ORIGINS: [],
      CSRF_SECRET: process.env.CSRF_SECRET,
    });
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(() => {
    for (const [key, value] of Object.entries(originalEnvironment)) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
  });

  it('/health (GET) returns 200 when the database is reachable', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect({ status: 'ok', database: 'connected' });
  });

  it('/health (GET) returns 503 when the database is unreachable', () => {
    prisma.$queryRaw.mockRejectedValueOnce(new Error('Database unavailable'));

    return request(app.getHttpServer())
      .get('/health')
      .expect(503)
      .expect((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({ message: 'Database is unreachable.' }),
        );
      });
  });

  it('/servicos (GET) rejects an anonymous administrative request', () => {
    return request(app.getHttpServer()).get('/servicos').expect(401);
  });

  it('completes login, me, CSRF logout and rejects the revoked session', async () => {
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    expect(login.body as unknown).toMatchObject({
      usuario: { papel: 'CLIENTE', permissoes: ['CRIAR_AGENDAMENTO'] },
    });
    expect(JSON.stringify(login.headers['set-cookie'])).not.toContain('senha correta de teste');

    await agente
      .get('/auth/me')
      .expect(200)
      .expect((response) => {
        const body = response.body as unknown as { usuario: Record<string, unknown> };
        expect(body.usuario).not.toHaveProperty('sessaoId');
        expect(body.usuario).not.toHaveProperty('senhaHash');
      });

    const cookies = login.headers['set-cookie'] as unknown as string[];
    const csrfCookie = cookies.find((cookie) => cookie.startsWith('csrf='));
    const csrf = csrfCookie?.split(';')[0].slice('csrf='.length);
    expect(csrf).toBeTruthy();
    await agente.post('/auth/logout').set('X-CSRF-Token', csrf!).expect(200);
    await agente.get('/auth/me').expect(401);
  });

  it('/api-json (GET) exposes the OpenAPI contract', async () => {
    const response = await request(app.getHttpServer()).get('/api-json').expect(200);
    const document = response.body as OpenApiDocument;
    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining([
        '/servicos',
        '/agendamentos',
        '/agendamentos/{id}/historico-status',
        '/administradores',
        '/papeis',
        '/permissoes',
        '/comissoes',
        '/auth/login',
        '/auth/me',
        '/auth/csrf',
        '/auth/logout',
        '/publico/servicos',
      ]),
    );
    expect(document.tags.map((tag) => tag.name)).toEqual(expect.arrayContaining(['Serviços']));
  });
});
