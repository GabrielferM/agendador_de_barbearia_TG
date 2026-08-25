import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { configurarSwagger } from './../src/config/swagger';

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
  };
  const prisma = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/barbearia_test';
    process.env.NODE_ENV = 'test';
    delete process.env.CORS_ORIGINS;
    prisma.$queryRaw.mockReset().mockResolvedValue([{ result: 1 }]);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    configurarSwagger(app, {
      DATABASE_URL: process.env.DATABASE_URL,
      PORT: 3000,
      NODE_ENV: 'test',
      CORS_ORIGINS: [],
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

  it('/api-json (GET) exposes the OpenAPI contract', async () => {
    const response = await request(app.getHttpServer()).get('/api-json').expect(200);
    const document = response.body as OpenApiDocument;
    expect(Object.keys(document.paths)).toEqual(
      expect.arrayContaining(['/servicos', '/agendamentos']),
    );
    expect(document.tags.map((tag) => tag.name)).toEqual(expect.arrayContaining(['Serviços']));
  });
});
