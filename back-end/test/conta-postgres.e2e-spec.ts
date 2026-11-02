import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../src/prisma/prisma.service';
import { SenhaService } from '../src/common/security/senha.service';
import { SessaoService } from '../src/modules/autenticacao/service/sessao.service';
import { RecuperarSenhaService } from '../src/modules/autenticacao/service/recuperar-senha.service';
import { EmailContaService } from '../src/modules/autenticacao/service/email-conta.service';
import { LimiteRecuperacaoService } from '../src/modules/autenticacao/service/limite-recuperacao.service';
import { CriarClienteService } from '../src/modules/cliente/service/criar-cliente.service';
import { CadastrarClienteService } from '../src/modules/autenticacao/service/cadastrar-cliente.service';

// Opt-in: apenas banco local descartável com nome terminado em _auth_test.
// Aplique migrations nesse banco antes de executar; esta suíte não executa DDL.
const databaseUrl = process.env.DATABASE_URL_TESTE;
const suite = databaseUrl ? describe : describe.skip;
suite('Contas com PostgreSQL isolado (integração real, opt-in)', () => {
  let prisma: PrismaService;
  const senhas = new SenhaService();
  let sessoes: SessaoService;
  let recuperar: RecuperarSenhaService;
  let cadastro: CadastrarClienteService;
  let idUsuario: number;
  let idPapel: number;
  const prefixo = `auth-teste-${Date.now()}`;
  const emails = {
    recuperar: jest.fn(),
    notificarAlteracao: jest.fn().mockResolvedValue(undefined),
  };
  beforeAll(async () => {
    const url = new URL(databaseUrl!);
    if (
      !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) ||
      !url.pathname.endsWith('_auth_test')
    )
      throw new Error('Use somente PostgreSQL local descartável *_auth_test.');
    prisma = new PrismaService(new ConfigService({ DATABASE_URL: databaseUrl }));
    await prisma.onModuleInit();
    // Banco dedicado vazio de dados; nunca usa seed completo.
    const papel = await prisma.papel.create({ data: { codigo: 'CLIENTE', nome: 'Cliente' } });
    idPapel = papel.id;
    const usuario = await prisma.usuario.create({
      data: {
        nome: 'Teste',
        email: `${prefixo}@example.com`,
        senhaHash: await senhas.gerarHash('senha antiga muito longa'),
        idPapel,
      },
    });
    idUsuario = usuario.id;
    sessoes = new SessaoService(prisma);
    recuperar = new RecuperarSenhaService(
      prisma,
      senhas,
      sessoes,
      emails as unknown as EmailContaService,
      new LimiteRecuperacaoService(),
    );
    cadastro = new CadastrarClienteService(new CriarClienteService(prisma, senhas));
  });
  afterAll(async () => {
    if (!prisma) return;
    if (idPapel) {
      await prisma.usuario.deleteMany({ where: { idPapel } });
      await prisma.papel.delete({ where: { id: idPapel } });
    }
    await prisma.onModuleDestroy();
  });
  async function novoToken() {
    const token = sessoes.novoToken();
    await prisma.recuperacaoSenha.create({
      data: {
        idUsuario,
        tokenHash: sessoes.hashToken(token),
        dataExpiracao: new Date(Date.now() + 900_000),
      },
    });
    return token;
  }
  it('um mesmo token concorrente altera uma única vez e revoga todas as sessões', async () => {
    const token = await novoToken();
    await prisma.sessao.create({
      data: {
        idUsuario,
        tokenHash: sessoes.hashToken(sessoes.novoToken()),
        dataExpiracao: new Date(Date.now() + 900_000),
      },
    });
    const resultados = await Promise.allSettled(
      [1, 2].map(() => recuperar.redefinir({ token, senha: 'senha nova longa de teste' })),
    );
    expect(resultados.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    expect(await prisma.sessao.count({ where: { idUsuario, dataRevogacao: null } })).toBe(0);
    expect(await prisma.recuperacaoSenha.count({ where: { idUsuario, dataConsumo: null } })).toBe(
      0,
    );
  });
  it('tokens diferentes do mesmo usuário não podem vencer simultaneamente', async () => {
    const tokens = await Promise.all([novoToken(), novoToken()]);
    const resultados = await Promise.allSettled(
      tokens.map((token) => recuperar.redefinir({ token, senha: 'outra senha longa de teste' })),
    );
    expect(resultados.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
  });
  it('CPF duplicado concorrente não deixa usuário órfão; e-mail também é único', async () => {
    const entradas = [1, 2].map((numero) => ({
      nome: 'Cliente',
      email: `${prefixo}-${numero}@example.com`,
      cpf: '52998224725',
      senha: 'senha segura longa teste',
    }));
    const resultados = await Promise.allSettled(
      entradas.map((entrada) => cadastro.execute(entrada)),
    );
    expect(resultados.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    const usuarios = await prisma.usuario.findMany({
      where: { email: { in: entradas.map((item) => item.email) } },
      include: { cliente: true },
    });
    expect(usuarios).toHaveLength(1);
    expect(usuarios[0].cliente).not.toBeNull();
    const duplicado = {
      nome: 'Cliente',
      email: `${prefixo}-email@example.com`,
      cpf: '11144477735',
      senha: 'senha segura longa teste',
    };
    const emailResultados = await Promise.allSettled([1, 2].map(() => cadastro.execute(duplicado)));
    expect(emailResultados.filter((item) => item.status === 'fulfilled')).toHaveLength(1);
    expect(await prisma.usuario.count({ where: { email: duplicado.email } })).toBe(1);
  });
});
