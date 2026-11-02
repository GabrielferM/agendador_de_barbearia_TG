import { EmailContaService } from '../src/modules/autenticacao/service/email-conta.service';
jest.mock('node:timers/promises', () => ({ setTimeout: jest.fn().mockResolvedValue(undefined) }));
import { Prisma } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from './../src/prisma/prisma.service';
import { configurarSwagger } from './../src/config/swagger';
import { SenhaService } from './../src/common/security/senha.service';
import { configurarValidacao } from './../src/config/validacao';

interface OpenApiDocument {
  paths: Record<string, Record<string, { responses?: Record<string, unknown> } | undefined>>;
  tags: Array<{ name: string }>;
  components?: {
    schemas?: Record<string, Record<string, unknown>>;
  };
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const originalEnvironment = {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    CORS_ORIGINS: process.env.CORS_ORIGINS,
    CSRF_SECRET: process.env.CSRF_SECRET,
  };
  const emails = {
    recuperar: jest.fn().mockResolvedValue(undefined),
    notificarAlteracao: jest.fn().mockResolvedValue(undefined),
  };
  const prisma = {
    papel: { findUnique: jest.fn() },
    recuperacaoSenha: { create: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
    historicoStatusAgendamento: { create: jest.fn().mockResolvedValue({}) },
    comissao: { findMany: jest.fn(), count: jest.fn() },
    filial: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    barbeiro: { findUnique: jest.fn() },
    cliente: {
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      count: jest.fn().mockResolvedValue(0),
    },
    servico: {
      findMany: jest.fn(),
      count: jest.fn().mockResolvedValue(0),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    agendamentoServico: { groupBy: jest.fn().mockResolvedValue([]) },
    agendamento: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    $queryRaw: jest.fn(),
    $transaction: jest.fn(),
    usuario: { findUnique: jest.fn(), update: jest.fn(), updateMany: jest.fn(), create: jest.fn() },
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
    prisma.papel.findUnique.mockReset().mockResolvedValue({ id: 1, ativo: true });
    prisma.usuario.create.mockReset();
    prisma.recuperacaoSenha.create.mockReset().mockResolvedValue({ id: 'recuperacao-teste' });
    prisma.recuperacaoSenha.findUnique.mockReset().mockResolvedValue(null);
    prisma.recuperacaoSenha.updateMany.mockReset().mockResolvedValue({ count: 1 });
    emails.recuperar.mockClear();
    emails.notificarAlteracao.mockClear();
    prisma.$queryRaw.mockReset().mockResolvedValue([{ result: 1 }]);
    sessaoAtual = null;
    prisma.filial.findUnique.mockReset().mockResolvedValue({ id: 1, status: 'ATIVA' });
    prisma.filial.findMany.mockReset().mockResolvedValue([]);
    prisma.filial.count.mockReset().mockResolvedValue(0);
    prisma.filial.create.mockReset();
    prisma.filial.update.mockReset();
    prisma.barbeiro.findUnique.mockReset().mockResolvedValue({
      id: 2,
      idFilial: 1,
      statusProfissional: 'ATIVO',
      usuario: { status: 'ATIVO' },
    });
    prisma.cliente.findUnique.mockReset().mockResolvedValue({ id: 1 });
    prisma.servico.findUnique.mockReset();
    prisma.servico.update.mockReset();
    prisma.servico.findMany
      .mockReset()
      .mockResolvedValue([
        { id: 3, ativo: true, precoBase: new Prisma.Decimal('50'), duracaoMinutos: 30 },
      ]);
    prisma.agendamento.findMany.mockReset().mockResolvedValue([]);
    prisma.agendamento.findFirst.mockReset().mockResolvedValue(null);
    prisma.agendamento.findUnique.mockReset().mockResolvedValue({ idCliente: 9, idBarbeiro: 2 });
    prisma.agendamento.create.mockReset();
    prisma.agendamento.update.mockReset();
    prisma.agendamento.count.mockReset().mockResolvedValue(0);
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
    prisma.usuario.updateMany.mockReset().mockResolvedValue({ count: 1 });
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
      .overrideProvider(EmailContaService)
      .useValue(emails)
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(cookieParser());
    configurarValidacao(app);
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

  it('permite 120 consultas por rota e IP e bloqueia a próxima com Retry-After', async () => {
    for (let i = 0; i < 120; i++) {
      await request(app.getHttpServer()).get('/').expect(200);
    }
    const resposta = await request(app.getHttpServer()).get('/').expect(429);
    expect(Number(resposta.headers['retry-after'])).toBeGreaterThan(0);
    await request(app.getHttpServer()).get('/health').expect(200);
  });

  it('mantém o limite de dez tentativas exclusivamente no login', async () => {
    for (let i = 0; i < 10; i++) {
      await request(app.getHttpServer()).post('/auth/login').send({}).expect(400);
    }
    const resposta = await request(app.getHttpServer()).post('/auth/login').send({}).expect(429);
    expect(Number(resposta.headers['retry-after'])).toBeGreaterThan(0);
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it('protege comissões por sessão e permissão ativa, inclusive em acesso direto', async () => {
    await request(app.getHttpServer()).get('/comissoes').expect(401);
    const agente = request.agent(app.getHttpServer());
    await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    await agente.get('/comissoes').expect(403);
    const usuario = sessaoAtual!.usuario as { papel: { codigo: string; permissoes: unknown[] } };
    usuario.papel.codigo = 'ADMINISTRADOR';
    await agente.get('/comissoes').expect(403);
    usuario.papel.permissoes = [
      { ativo: false, permissao: { ativo: true, codigo: 'GERENCIAR_COMISSOES' } },
    ];
    await agente.get('/comissoes').expect(403);
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: false, codigo: 'GERENCIAR_COMISSOES' } },
    ];
    await agente.get('/comissoes').expect(403);
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: true, codigo: 'GERENCIAR_COMISSOES' } },
    ];
    prisma.comissao.findMany.mockResolvedValue([]);
    prisma.comissao.count.mockResolvedValue(0);
    await agente.get('/comissoes').expect(200);
    const me = await agente.get('/auth/me').expect(200);
    expect(me.body as unknown).toMatchObject({ usuario: { permissoes: ['GERENCIAR_COMISSOES'] } });
  });

  it('altera apenas a ativação do serviço com sessão, permissão e CSRF e preserva os agendamentos', async () => {
    await request(app.getHttpServer()).patch('/servicos/3').send({ ativo: false }).expect(401);
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const csrf = (login.headers['set-cookie'] as unknown as string[])
      .find((cookie) => cookie.startsWith('csrf='))!
      .split(';')[0]
      .slice('csrf='.length);
    await agente.patch('/servicos/3').set('X-CSRF-Token', csrf).send({ ativo: false }).expect(403);
    const usuario = sessaoAtual!.usuario as { papel: { codigo: string; permissoes: unknown[] } };
    usuario.papel.codigo = 'ADMINISTRADOR';
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: true, codigo: 'GERENCIAR_SERVICOS' } },
    ];
    await agente.patch('/servicos/3').send({ ativo: false }).expect(403);
    for (const ativo of ['false', 0, null]) {
      await agente.patch('/servicos/3').set('X-CSRF-Token', csrf).send({ ativo }).expect(400);
    }
    await agente
      .patch('/servicos/3')
      .set('X-CSRF-Token', csrf)
      .send({ ativo: false, extra: true })
      .expect(400);
    expect(prisma.servico.update).not.toHaveBeenCalled();
    const servico = {
      id: 3,
      nome: 'Corte',
      descricao: null,
      precoBase: new Prisma.Decimal('50'),
      duracaoMinutos: 30,
      ativo: true,
    };
    prisma.servico.findUnique.mockResolvedValue(servico);
    prisma.servico.update.mockImplementation(({ data }: { data: { ativo: boolean } }) => {
      servico.ativo = data.ativo;
      return Promise.resolve({ ...servico });
    });
    for (const ativo of [false, true]) {
      const resposta = await agente
        .patch('/servicos/3')
        .set('X-CSRF-Token', csrf)
        .send({ ativo })
        .expect(200);
      expect(resposta.body as unknown).toMatchObject({
        id: 3,
        nome: 'Corte',
        precoBase: '50.00',
        duracaoMinutos: 30,
        ativo,
      });
      expect(prisma.servico.update).toHaveBeenLastCalledWith({ where: { id: 3 }, data: { ativo } });
    }
    expect(prisma.agendamento.update).not.toHaveBeenCalled();
    expect(prisma.agendamento.create).not.toHaveBeenCalled();
    prisma.servico.findUnique.mockResolvedValue(null);
    await agente.patch('/servicos/99').set('X-CSRF-Token', csrf).send({ ativo: false }).expect(404);
  });

  it('oculta serviços inativos do catálogo público e rejeita novas reservas', async () => {
    await request(app.getHttpServer()).get('/publico/servicos').expect(200);
    expect(prisma.servico.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { ativo: true } }),
    );
    prisma.servico.findMany.mockResolvedValue([
      { id: 3, ativo: false, precoBase: new Prisma.Decimal('50'), duracaoMinutos: 30 },
    ]);
    await request(app.getHttpServer())
      .get(
        '/agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-01-07&servicoIds=3',
      )
      .expect(400);
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const csrf = (login.headers['set-cookie'] as unknown as string[])
      .find((cookie) => cookie.startsWith('csrf='))!
      .split(';')[0]
      .slice('csrf='.length);
    await agente
      .post('/agendamentos')
      .set('X-CSRF-Token', csrf)
      .send({ idFilial: 1, idBarbeiro: 2, inicio: '2030-01-07T12:00:00Z', servicoIds: [3] })
      .expect(400);
    expect(prisma.agendamento.create).not.toHaveBeenCalled();
  });

  async function autenticarAdministradorFiliais() {
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const csrf = (login.headers['set-cookie'] as unknown as string[])
      .find((cookie) => cookie.startsWith('csrf='))!
      .split(';')[0]
      .slice('csrf='.length);
    const usuario = sessaoAtual!.usuario as { papel: { codigo: string; permissoes: unknown[] } };
    usuario.papel.codigo = 'ADMINISTRADOR';
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: true, codigo: 'GERENCIAR_FILIAIS' } },
    ];
    return { agente, csrf };
  }

  const enderecoFilial = {
    cep: '01001000',
    logradouro: 'Praça da Sé',
    numero: '1',
    bairro: 'Sé',
    cidade: 'São Paulo',
    estado: 'SP',
  };
  const cadastroFilial = { nome: 'Centro', cnpj: '11222333000181', endereco: enderecoFilial };
  const filialCompleta = {
    id: 1,
    idEndereco: 5,
    ...cadastroFilial,
    telefone: null,
    email: null,
    status: 'ATIVA',
    dataCadastro: new Date(),
    dataAtualizacao: new Date(),
    endereco: { id: 5, ...enderecoFilial, complemento: null },
  };

  it('protege filiais por sessão, permissão e CSRF e lista com paginação/status', async () => {
    await request(app.getHttpServer()).get('/filiais').expect(401);
    const { agente, csrf } = await autenticarAdministradorFiliais();
    await agente.post('/filiais').send(cadastroFilial).expect(403);
    const usuario = sessaoAtual!.usuario as { papel: { permissoes: unknown[] } };
    usuario.papel.permissoes = [];
    await agente.get('/filiais').expect(403);
    await agente.post('/filiais').set('X-CSRF-Token', csrf).send(cadastroFilial).expect(403);
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: true, codigo: 'GERENCIAR_FILIAIS' } },
    ];
    prisma.filial.findMany.mockResolvedValue([filialCompleta]);
    prisma.filial.count.mockResolvedValue(13);
    const resposta = await agente.get('/filiais?status=ATIVA&pagina=2&limite=12').expect(200);
    expect(resposta.body as unknown).toMatchObject({
      data: [{ id: 1, endereco: { cidade: 'São Paulo' } }],
      meta: { pagina: 2, limite: 12, total: 13, totalPaginas: 2 },
    });
    expect(prisma.filial.findMany).toHaveBeenLastCalledWith({
      include: { endereco: true },
      where: { status: 'ATIVA' },
      skip: 12,
      take: 12,
      orderBy: { id: 'asc' },
    });
    await agente.get('/filiais?status=INVALIDO').expect(400);
  });

  it('cadastra e edita filial com endereço, valida entradas e permite limpar opcionais', async () => {
    const { agente, csrf } = await autenticarAdministradorFiliais();
    prisma.filial.findUnique.mockResolvedValue(null);
    prisma.filial.create.mockResolvedValue(filialCompleta);
    const criada = await agente
      .post('/filiais')
      .set('X-CSRF-Token', csrf)
      .send({
        ...cadastroFilial,
        nome: ' Centro ',
        cnpj: '11.222.333/0001-81',
        endereco: { ...enderecoFilial, cep: '01001-000', estado: 'sp' },
      })
      .expect(201);
    expect(criada.body as unknown).toMatchObject({
      id: 1,
      status: 'ATIVA',
      endereco: { cep: '01001000' },
    });
    expect(prisma.filial.create).toHaveBeenCalledWith({
      data: {
        nome: 'Centro',
        cnpj: '11222333000181',
        telefone: undefined,
        email: null,
        endereco: { create: enderecoFilial },
      },
      include: { endereco: true },
    });
    for (const entrada of [
      { ...cadastroFilial, nome: '   ' },
      { ...cadastroFilial, cnpj: '123' },
      { ...cadastroFilial, endereco: undefined },
      { ...cadastroFilial, endereco: { ...enderecoFilial, cidade: ' ' } },
      { ...cadastroFilial, endereco: { ...enderecoFilial, cep: 'abcdefgh' } },
    ]) {
      await agente.post('/filiais').set('X-CSRF-Token', csrf).send(entrada).expect(400);
    }
    prisma.filial.findUnique.mockResolvedValue(filialCompleta);
    await agente.post('/filiais').set('X-CSRF-Token', csrf).send(cadastroFilial).expect(409);
    await agente.get('/filiais/1').expect(200);
    prisma.filial.update.mockResolvedValue({ ...filialCompleta, status: 'INATIVA' });
    await agente
      .patch('/filiais/1')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'INATIVA', telefone: null, email: null, endereco: { complemento: null } })
      .expect(200);
    expect(prisma.filial.update).toHaveBeenLastCalledWith({
      where: { id: 1 },
      data: {
        status: 'INATIVA',
        telefone: null,
        email: null,
        endereco: { update: { complemento: null } },
      },
      include: { endereco: true },
    });
    for (const status of ['EM_MANUTENCAO', 'ATIVA']) {
      prisma.filial.update.mockResolvedValue({ ...filialCompleta, status });
      await agente.patch('/filiais/1').set('X-CSRF-Token', csrf).send({ status }).expect(200);
      expect(prisma.filial.update).toHaveBeenLastCalledWith({
        where: { id: 1 },
        data: { status },
        include: { endereco: true },
      });
    }
    for (const entrada of [
      { status: 'INVALIDO' },
      { status: null },
      { nome: ' ' },
      { endereco: { numero: ' ' } },
      { email: 'invalido' },
    ]) {
      await agente.patch('/filiais/1').set('X-CSRF-Token', csrf).send(entrada).expect(400);
    }
    prisma.filial.update.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Conflito', {
        code: 'P2002',
        clientVersion: 'teste',
      }),
    );
    await agente
      .patch('/filiais/1')
      .set('X-CSRF-Token', csrf)
      .send({ cnpj: cadastroFilial.cnpj })
      .expect(409);
    expect(prisma.agendamento.update).not.toHaveBeenCalled();
    prisma.filial.findUnique.mockResolvedValue(null);
    await agente.get('/filiais/99').expect(404);
    await agente
      .patch('/filiais/99')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'INATIVA' })
      .expect(404);
  });

  it.each(['INATIVA', 'EM_MANUTENCAO'])(
    'bloqueia novas reservas em filial %s sem alterar agendamentos',
    async (status) => {
      await request(app.getHttpServer()).get('/publico/filiais').expect(200);
      expect(prisma.filial.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: 'ATIVA' } }),
      );
      prisma.filial.findUnique.mockResolvedValue({ ...filialCompleta, status });
      await request(app.getHttpServer())
        .get(
          '/agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-01-07&servicoIds=3',
        )
        .expect(400);
      const { agente, csrf } = await autenticarAdministradorFiliais();
      const usuario = sessaoAtual!.usuario as { papel: { codigo: string; permissoes: unknown[] } };
      usuario.papel.codigo = 'CLIENTE';
      usuario.papel.permissoes = [
        { ativo: true, permissao: { ativo: true, codigo: 'CRIAR_AGENDAMENTO' } },
      ];
      await agente
        .post('/agendamentos')
        .set('X-CSRF-Token', csrf)
        .send({ idFilial: 1, idBarbeiro: 2, inicio: '2030-01-07T12:00:00Z', servicoIds: [3] })
        .expect(400);
      expect(prisma.agendamento.create).not.toHaveBeenCalled();
      expect(prisma.agendamento.update).not.toHaveBeenCalled();
    },
  );

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

  it('uses the production validation policy without exposing rejected values', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'cliente@teste.local',
        senha: 'senha correta de teste',
        campoDesconhecido: 'valor-que-nao-deve-aparecer',
      })
      .expect(400);

    expect(response.body).toMatchObject({ statusCode: 400 });
    expect(JSON.stringify(response.body)).not.toContain('valor-que-nao-deve-aparecer');
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

  it('consulta horários publicamente e valida parâmetros repetidos', async () => {
    const resposta = await request(app.getHttpServer())
      .get(
        '/agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-01-07&servicoIds=3',
      )
      .expect(200);
    expect(resposta.body as unknown).toMatchObject({
      valorTotal: '50.00',
      duracaoTotalMinutos: 30,
    });
    expect(JSON.stringify(resposta.body)).not.toContain('idCliente');
    await request(app.getHttpServer())
      .get(
        '/agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-02-30&servicoIds=3',
      )
      .expect(400);
    await request(app.getHttpServer())
      .get(
        '/agendamentos/horarios-disponiveis?idFilial=1&idBarbeiro=2&data=2030-01-07&servicoIds=3&servicoIds=3',
      )
      .expect(400);
    await request(app.getHttpServer()).post('/agendamentos').send({}).expect(401);
  });

  it('exige CSRF, impede acesso alheio e cria uma resposta sanitizada', async () => {
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const cookies = login.headers['set-cookie'] as unknown as string[];
    const csrf = cookies
      .find((cookie) => cookie.startsWith('csrf='))!
      .split(';')[0]
      .slice(5);
    const dto = {
      idCliente: 1,
      idFilial: 1,
      idBarbeiro: 2,
      inicio: '2030-01-07T12:00:00Z',
      servicoIds: [3],
    };
    await agente.post('/agendamentos').send(dto).expect(403);
    await agente.get('/agendamentos/99').expect(403);
    await agente
      .patch('/agendamentos/99')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'CANCELADO', motivoCancelamento: 'Outro compromisso' })
      .expect(403);
    await agente
      .post('/agendamentos')
      .set('X-CSRF-Token', csrf)
      .send({ ...dto, idCliente: 9 })
      .expect(403);
    prisma.agendamento.create.mockResolvedValue({
      id: 10,
      inicioPrevisto: new Date(dto.inicio),
      fimPrevisto: new Date('2030-01-07T12:30:00Z'),
      status: 'PENDENTE',
      cliente: { cpf: 'dado-privado' },
      observacaoInterna: 'interno',
      filial: {
        id: 1,
        nome: 'Centro',
        telefone: null,
        cnpj: 'privado',
        endereco: {
          cep: '00000000',
          logradouro: 'Rua A',
          numero: '1',
          bairro: 'Centro',
          cidade: 'São Paulo',
          estado: 'SP',
        },
      },
      barbeiro: { id: 2, nomeProfissional: 'João', usuario: { email: 'privado' } },
      servicos: [
        {
          idServico: 3,
          precoAplicado: new Prisma.Decimal('50'),
          subtotal: new Prisma.Decimal('50'),
          duracaoAplicadaMinutos: 30,
          quantidade: 1,
          servico: { id: 3, nome: 'Corte' },
          comissao: { valor: 'privado' },
        },
      ],
    });
    const resultado = await agente
      .post('/agendamentos')
      .set('X-CSRF-Token', csrf)
      .send(dto)
      .expect(201);
    expect(resultado.body as unknown).toMatchObject({ id: 10, servicos: [{ subtotal: '50.00' }] });
    for (const campo of ['senhaHash', 'cpf', 'cnpj', 'observacaoInterna', 'comissao', 'email'])
      expect(JSON.stringify(resultado.body)).not.toContain(campo);
    const gravado = (await prisma.agendamento.create.mock.results[0].value) as Record<
      string,
      unknown
    >;
    prisma.agendamento.findUnique.mockResolvedValue({
      ...gravado,
      idCliente: 1,
      idBarbeiro: 2,
      idFilial: 1,
    });
    prisma.agendamento.update.mockResolvedValue({
      ...gravado,
      status: 'CANCELADO',
      motivoCancelamento: 'Outro compromisso',
    });
    await agente
      .patch('/agendamentos/10')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'CANCELADO' })
      .expect(400);
    await agente
      .patch('/agendamentos/10')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'CANCELADO', motivoCancelamento: 'Outro compromisso', inicio: dto.inicio })
      .expect(403);
    const cancelado = await agente
      .patch('/agendamentos/10')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'CANCELADO', motivoCancelamento: 'Outro compromisso' })
      .expect(200);
    expect(cancelado.body as unknown).toMatchObject({ status: 'CANCELADO' });
    prisma.agendamento.findFirst.mockResolvedValue({ id: 10 });
    await agente.post('/agendamentos').set('X-CSRF-Token', csrf).send(dto).expect(409);
  });

  it('protege as consultas do barbeiro e valida filtros e payloads pelo HTTP', async () => {
    for (const caminho of ['clientes', 'servicos', 'historico'])
      await request(app.getHttpServer()).get(`/dashboard/barbeiro/${caminho}`).expect(401);
    const agente = request.agent(app.getHttpServer());
    const login = await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const csrf = (login.headers['set-cookie'] as unknown as string[])
      .find((c) => c.startsWith('csrf='))!
      .split(';')[0]
      .slice(5);
    await agente.get('/dashboard/barbeiro/clientes').expect(403);
    const usuario = sessaoAtual!.usuario as {
      barbeiro: unknown;
      cliente: unknown;
      papel: { codigo: string; permissoes: unknown[] };
    };
    usuario.cliente = null;
    usuario.barbeiro = { id: 2 };
    usuario.papel.codigo = 'BARBEIRO';
    await agente.get('/dashboard/barbeiro/clientes').expect(403);
    usuario.papel.permissoes = [
      { ativo: true, permissao: { ativo: true, codigo: 'GERENCIAR_PROPRIA_AGENDA' } },
    ];
    const clientes = await agente
      .get('/dashboard/barbeiro/clientes?pagina=2&limite=10')
      .expect(200);
    expect(clientes.body as unknown).toMatchObject({ data: [], meta: { pagina: 2, total: 0 } });
    await agente.get('/dashboard/barbeiro/historico?status=PENDENTE').expect(400);
    await agente.get('/dashboard/barbeiro/servicos?inicioDe=2026-02-30').expect(400);
    await agente.get('/dashboard/barbeiro/servicos?idBarbeiro=9').expect(400);
    await agente
      .get('/dashboard/barbeiro/historico?inicioDe=2026-10-20&inicioAte=2026-10-01')
      .expect(400);
    await agente.get('/dashboard/barbeiro/historico?pagina=-1').expect(400);
    await agente
      .patch('/agendamentos/99')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'EM_ATENDIMENTO', inicio: '2030-01-01T12:00:00Z' })
      .expect(403);
    await agente
      .post('/agendamentos/99/historico-status')
      .set('X-CSRF-Token', csrf)
      .send({ idUsuarioResponsavel: 2, statusNovo: 'CONCLUIDO' })
      .expect(403);
    const registro = {
      id: 99,
      idCliente: 7,
      idBarbeiro: 2,
      inicioPrevisto: new Date('2030-01-07T12:00:00Z'),
      fimPrevisto: new Date('2030-01-07T13:00:00Z'),
      status: 'CONFIRMADO',
      servicos: [],
      cliente: { id: 7, cpf: 'privado', usuario: { nome: 'Cliente próprio', email: 'privado' } },
      barbeiro: { id: 2, nomeProfissional: 'Profissional', usuario: { email: 'privado' } },
      filial: { id: 1, nome: 'Centro', endereco: {} },
      observacaoInterna: 'privado',
    };
    prisma.agendamento.findUnique.mockResolvedValue(registro);
    prisma.agendamento.update.mockResolvedValue({ ...registro, status: 'EM_ATENDIMENTO' });
    const atualizado = await agente
      .patch('/agendamentos/99')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'EM_ATENDIMENTO' })
      .expect(200);
    expect(atualizado.body as unknown).toMatchObject({
      cliente: { id: 7, nome: 'Cliente próprio' },
      status: 'EM_ATENDIMENTO',
    });
    for (const campo of ['cpf', 'email', 'observacaoInterna', 'senhaHash', 'comissao'])
      expect(JSON.stringify(atualizado.body)).not.toContain(campo);
    expect(prisma.historicoStatusAgendamento.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        statusAnterior: 'CONFIRMADO',
        statusNovo: 'EM_ATENDIMENTO',
        idUsuarioResponsavel: 1,
      }),
    });
    usuario.barbeiro = { id: 3 };
    await agente.get('/agendamentos/99').expect(403);
    await agente
      .patch('/agendamentos/99')
      .set('X-CSRF-Token', csrf)
      .send({ status: 'EM_ATENDIMENTO' })
      .expect(403);
  });

  it.each(['papel', 'idPapel', 'status', 'permissoes', 'observacao', 'dataNascimento'])(
    'rejeita campo público privilegiado %s',
    async (campo) => {
      await request(app.getHttpServer())
        .post('/auth/cadastro-cliente')
        .send({
          nome: 'Cliente Teste',
          email: 'cliente@example.com',
          cpf: '52998224725',
          senha: 'senha segura longa',
          [campo]: 'privilegio',
        })
        .expect(400)
        .expect('Cache-Control', 'no-store');
      expect(prisma.usuario.create).not.toHaveBeenCalled();
    },
  );

  it('protege operações públicas por origem e JSON; mantém CRUD privado', async () => {
    await request(app.getHttpServer())
      .post('/auth/cadastro-cliente')
      .set('Origin', 'https://malicioso.example')
      .send({
        nome: 'Cliente Teste',
        email: 'cliente@example.com',
        cpf: '52998224725',
        senha: 'senha segura longa',
      })
      .expect(403);
    await request(app.getHttpServer())
      .post('/auth/recuperar-senha')
      .set('Content-Type', 'text/plain')
      .send('{}')
      .expect(415);
    await request(app.getHttpServer()).get('/clientes').expect(401);
  });

  it('recuperação anônima responde genericamente para conta inexistente e existente', async () => {
    prisma.usuario.findUnique.mockResolvedValueOnce(null);
    const ausente = await request(app.getHttpServer())
      .post('/auth/recuperar-senha')
      .send({ email: 'inexistente@example.com' })
      .expect(200);
    const existente = await request(app.getHttpServer())
      .post('/auth/recuperar-senha')
      .send({ email: 'cliente@teste.local' })
      .expect(200);
    expect(ausente.body as unknown).toEqual(existente.body);
    expect(existente.headers['cache-control']).toBe('no-store');
    expect(emails.recuperar).toHaveBeenCalledTimes(1);
    await request(app.getHttpServer())
      .post('/auth/recuperar-senha')
      .send({ email: ' CLIENTE@TESTE.LOCAL ' })
      .expect(429)
      .expect('Retry-After', '60');
    await request(app.getHttpServer()).get('/').expect(200);
  });

  it('cadastro permite login normal e nunca estabelece sessão por si só', async () => {
    const senha = ' senha nova muito longa ';
    prisma.usuario.findUnique.mockResolvedValue(null);
    prisma.cliente.findUnique.mockResolvedValue(null);
    prisma.usuario.create.mockImplementation(({ data }: { data: Record<string, unknown> }) => {
      const usuario = {
        ...data,
        id: 25,
        cliente: { id: 25 },
        status: 'ATIVO',
        papel: { codigo: 'CLIENTE', ativo: true, permissoes: [] },
      };
      prisma.usuario.findUnique.mockResolvedValue(usuario);
      return Promise.resolve(usuario);
    });
    const resultado = await request(app.getHttpServer())
      .post('/auth/cadastro-cliente')
      .send({ nome: 'Cliente Novo', email: 'novo@example.com', cpf: '52998224725', senha })
      .expect(200);
    expect(resultado.headers['set-cookie']).toBeUndefined();
    expect(JSON.stringify(resultado.body)).not.toContain('senhaHash');
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'novo@example.com', senha })
      .expect(200);
  });

  it('redefinição revoga sessão anterior e permite login só com senha nova', async () => {
    const agente = request.agent(app.getHttpServer());
    await agente
      .post('/auth/login')
      .send({ email: 'cliente@teste.local', senha: 'senha correta de teste' })
      .expect(200);
    const usuario = sessaoAtual!.usuario as {
      senhaHash: string;
      email: string;
      status: string;
      papel: object;
    };
    let consumido = false;
    prisma.recuperacaoSenha.findUnique.mockImplementation(() => ({
      id: 'r1',
      idUsuario: 1,
      dataConsumo: consumido ? new Date() : null,
      dataExpiracao: new Date(Date.now() + 60_000),
      usuario,
    }));
    prisma.recuperacaoSenha.updateMany.mockImplementation(() => {
      consumido = true;
      return Promise.resolve({ count: 1 });
    });
    prisma.usuario.update.mockImplementation(({ data }: { data: { senhaHash?: string } }) => {
      if (data.senhaHash) usuario.senhaHash = data.senhaHash;
      return Promise.resolve(usuario);
    });
    const entrada = { token: 't'.repeat(43), senha: ' nova senha segura longa ' };
    await request(app.getHttpServer()).post('/auth/redefinir-senha').send(entrada).expect(200);
    await agente.get('/auth/me').expect(401);
    await request(app.getHttpServer()).post('/auth/redefinir-senha').send(entrada).expect(400);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: usuario.email, senha: 'senha correta de teste' })
      .expect(401);
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: usuario.email, senha: entrada.senha })
      .expect(200);
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
        '/auth/cadastro-cliente',
        '/auth/recuperar-senha',
        '/auth/redefinir-senha',
        '/publico/servicos',
        '/dashboard/barbeiro/clientes',
        '/dashboard/barbeiro/servicos',
        '/dashboard/barbeiro/historico',
      ]),
    );
    expect(document.tags.map((tag) => tag.name)).toEqual(expect.arrayContaining(['Serviços']));
    expect(Object.keys(document.paths['/auth/login'].post?.responses ?? {})).toEqual(
      expect.arrayContaining(['200', '400', '401', '403', '415', '429']),
    );
    expect(Object.keys(document.paths['/servicos'].get?.responses ?? {})).toEqual(
      expect.arrayContaining(['200', '400', '401', '403', '404', '409', '429']),
    );
    const schemaErro = document.components?.schemas?.ErroRespostaDto as
      { required?: string[] } | undefined;
    expect(schemaErro?.required ?? []).not.toContain('error');
    expect(document.components?.schemas?.AtualizarServicoDto).toMatchObject({
      properties: { ativo: { type: 'boolean' } },
    });
    expect(document.components?.schemas?.ListaFiliaisRespostaDto).toMatchObject({
      properties: {
        data: { type: 'array', items: { $ref: '#/components/schemas/FilialRespostaDto' } },
      },
    });
    expect(document.components?.schemas?.AtualizarFilialDto).toMatchObject({
      properties: { telefone: { nullable: true }, email: { nullable: true } },
    });
    expect(document.components?.schemas?.LimiteRequisicoesRespostaDto).toBeDefined();
  });
});
