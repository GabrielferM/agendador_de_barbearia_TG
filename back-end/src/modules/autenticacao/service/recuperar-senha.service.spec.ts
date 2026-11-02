import { RecuperarSenhaService, MENSAGEM_RECUPERACAO } from './recuperar-senha.service';
import { LimiteRecuperacaoService } from './limite-recuperacao.service';
import { SessaoService } from './sessao.service';
import { BadRequestException } from '@nestjs/common';
jest.mock('node:timers/promises', () => ({ setTimeout: jest.fn().mockResolvedValue(undefined) }));

describe('Recuperação de senha (transação simulada)', () => {
  const prisma = {
    usuario: { findUnique: jest.fn(), update: jest.fn() },
    recuperacaoSenha: { create: jest.fn(), findUnique: jest.fn(), updateMany: jest.fn() },
    sessao: { updateMany: jest.fn() },
    $transaction: jest.fn(),
  };
  const emails = { recuperar: jest.fn(), notificarAlteracao: jest.fn() };
  const senhas = { gerarHash: jest.fn() };
  const sessoes = new SessaoService(prisma as never);
  let service: RecuperarSenhaService;
  const registro = () => ({
    id: 'r1',
    idUsuario: 1,
    dataConsumo: null,
    dataExpiracao: new Date(Date.now() + 60_000),
    usuario: { email: 'pessoa@example.com', status: 'ATIVO', papel: { ativo: true } },
  });
  beforeEach(() => {
    jest.clearAllMocks();
    service = new RecuperarSenhaService(
      prisma as never,
      senhas as never,
      sessoes,
      emails as never,
      new LimiteRecuperacaoService(),
    );
    prisma.$transaction.mockImplementation((operacao: (tx: typeof prisma) => unknown) =>
      operacao(prisma),
    );
    prisma.usuario.findUnique.mockResolvedValue({ id: 1, status: 'ATIVO', papel: { ativo: true } });
    prisma.recuperacaoSenha.create.mockResolvedValue({ id: 'r1' });
    prisma.recuperacaoSenha.findUnique.mockResolvedValue(registro());
    prisma.recuperacaoSenha.updateMany.mockResolvedValue({ count: 1 });
    emails.recuperar.mockResolvedValue(undefined);
    emails.notificarAlteracao.mockResolvedValue(undefined);
    senhas.gerarHash.mockResolvedValue('hash-seguro');
  });
  it.each([
    null,
    { status: 'INATIVO', papel: { ativo: true } },
    { status: 'BLOQUEADO', papel: { ativo: true } },
    { status: 'ATIVO', papel: { ativo: false } },
  ])('responde genericamente para conta inelegível %j', async (usuario) => {
    prisma.usuario.findUnique.mockResolvedValue(usuario);
    await expect(service.solicitar(' Pessoa@Example.COM ')).resolves.toEqual({
      mensagem: MENSAGEM_RECUPERACAO,
    });
    expect(emails.recuperar).not.toHaveBeenCalled();
    expect(prisma.recuperacaoSenha.create).not.toHaveBeenCalled();
    expect(prisma.usuario.update).not.toHaveBeenCalled();
    expect(prisma.sessao.updateMany).not.toHaveBeenCalled();
  });
  it('armazena somente hash de token aleatório, com prazo de 15 minutos', async () => {
    await expect(service.solicitar(' Pessoa@Example.COM ')).resolves.toEqual({
      mensagem: MENSAGEM_RECUPERACAO,
    });
    const [email, token] = emails.recuperar.mock.calls[0] as [string, string];
    expect(email).toBe('pessoa@example.com');
    expect(Buffer.from(token, 'base64url')).toHaveLength(32);
    expect(prisma.recuperacaoSenha.create).toHaveBeenCalledWith({
      data: {
        idUsuario: 1,
        tokenHash: sessoes.hashToken(token),
        dataExpiracao: expect.any(Date) as Date,
      },
    });
    expect(JSON.stringify(prisma.recuperacaoSenha.create.mock.calls)).not.toContain(token);
    expect(prisma.sessao.updateMany).not.toHaveBeenCalled();
  });
  it('falha ao persistir o token também mantém a resposta pública genérica', async () => {
    prisma.recuperacaoSenha.create.mockRejectedValueOnce(new Error('falha interna'));
    await expect(service.solicitar('pessoa@example.com')).resolves.toEqual({
      mensagem: MENSAGEM_RECUPERACAO,
    });
    expect(emails.recuperar).not.toHaveBeenCalled();
  });

  it('falha do provedor mantém resposta genérica e invalida o link não enviado', async () => {
    emails.recuperar.mockRejectedValue(new Error('detalhe privado'));
    await expect(service.solicitar('pessoa@example.com')).resolves.toEqual({
      mensagem: MENSAGEM_RECUPERACAO,
    });
    expect(prisma.recuperacaoSenha.updateMany).toHaveBeenCalledWith({
      where: { id: 'r1', dataConsumo: null },
      data: { dataConsumo: expect.any(Date) as Date },
    });
  });
  it.each(['ausente', 'expirado', 'usado', 'inativo', 'papel inativo'])(
    'rejeita token %s sem mudar senha/sessões',
    async (caso) => {
      const item = registro();
      if (caso === 'expirado') item.dataExpiracao = new Date(0);
      if (caso === 'inativo') item.usuario.status = 'BLOQUEADO';
      if (caso === 'papel inativo') item.usuario.papel.ativo = false;
      prisma.recuperacaoSenha.findUnique.mockResolvedValue(
        caso === 'ausente' ? null : caso === 'usado' ? { ...item, dataConsumo: new Date() } : item,
      );
      await expect(
        service.redefinir({ token: 't'.repeat(43), senha: ' senha com espaços ' }),
      ).rejects.toBeInstanceOf(BadRequestException);
      expect(prisma.usuario.update).not.toHaveBeenCalled();
      expect(prisma.sessao.updateMany).not.toHaveBeenCalled();
    },
  );
  it('troca senha, invalida todos os links e revoga sessões no mesmo tx; notificação pode falhar', async () => {
    emails.notificarAlteracao.mockRejectedValue(new Error('falha'));
    await expect(
      service.redefinir({ token: 't'.repeat(43), senha: ' senha com espaços ' }),
    ).resolves.toHaveProperty('mensagem');
    expect(senhas.gerarHash).toHaveBeenCalledWith(' senha com espaços ');
    expect(prisma.$transaction).toHaveBeenCalledWith(expect.any(Function), {
      isolationLevel: 'Serializable',
    });
    expect(prisma.usuario.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { senhaHash: 'hash-seguro' },
    });
    expect(prisma.recuperacaoSenha.updateMany).toHaveBeenLastCalledWith({
      where: { idUsuario: 1, dataConsumo: null },
      data: { dataConsumo: expect.any(Date) as Date },
    });
    expect(prisma.sessao.updateMany).toHaveBeenCalledWith({
      where: { idUsuario: 1, dataRevogacao: null },
      data: { dataRevogacao: expect.any(Date) as Date },
    });
  });
  it('apenas uma disputa de consumo pode atualizar a senha (CAS simulado)', async () => {
    prisma.recuperacaoSenha.updateMany
      .mockResolvedValue({ count: 0 })
      .mockResolvedValueOnce({ count: 1 });
    const resultados = await Promise.allSettled(
      [1, 2].map(() =>
        service.redefinir({ token: 't'.repeat(43), senha: 'senha muito longa e segura' }),
      ),
    );
    expect(resultados.filter((r) => r.status === 'fulfilled')).toHaveLength(1);
    expect(prisma.usuario.update).toHaveBeenCalledTimes(1);
  });
});
