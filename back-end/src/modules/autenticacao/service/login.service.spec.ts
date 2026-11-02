import { LoginService } from './login.service';

describe('Login e redefinição concorrente', () => {
  it('não emite sessão se a senha mudar depois da verificação', async () => {
    const usuario = { id: 1, senhaHash: 'hash-anterior', status: 'ATIVO', papel: { ativo: true } };
    const tx = {
      usuario: { updateMany: jest.fn().mockResolvedValue({ count: 0 }) },
      sessao: { create: jest.fn() },
    };
    const prisma = {
      usuario: { findUnique: jest.fn().mockResolvedValue(usuario) },
      $transaction: jest
        .fn()
        .mockImplementation((operacao: (transaction: typeof tx) => unknown) => operacao(tx)),
    };
    const senhas = {
      gerarHash: jest.fn().mockResolvedValue('ficticio'),
      verificar: jest.fn().mockResolvedValue({ valida: true, precisaMigrar: false }),
    };
    const sessoes = { novoToken: jest.fn().mockReturnValue('token-novo') };
    const service = new LoginService(prisma as never, senhas, sessoes as never);
    await expect(
      service.execute({ email: 'cliente@example.com', senha: 'senha anteriormente correta' }),
    ).rejects.toThrow('E-mail ou senha inválidos.');
    expect(tx.sessao.create).not.toHaveBeenCalled();
  });
});
