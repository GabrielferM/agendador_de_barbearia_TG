import { SessaoService } from './sessao.service';

describe('SessaoService', () => {
  const prisma = { sessao: { updateMany: jest.fn() } };
  const service = new SessaoService(prisma as never);

  beforeEach(() => prisma.sessao.updateMany.mockReset().mockResolvedValue({ count: 1 }));

  it('gera 256 bits aleatórios e persiste somente um SHA-256 determinístico', () => {
    const primeiro = service.novoToken();
    const segundo = service.novoToken();
    expect(Buffer.from(primeiro, 'base64url')).toHaveLength(32);
    expect(primeiro).not.toBe(segundo);
    expect(service.hashToken(primeiro)).toMatch(/^[a-f0-9]{64}$/);
    expect(service.hashToken(primeiro)).toBe(service.hashToken(primeiro));
  });

  it('revoga a sessão pelo hash, sem consultar pelo token original', async () => {
    await service.revogar('token-secreto');
    expect(prisma.sessao.updateMany).toHaveBeenCalledWith({
      where: { tokenHash: service.hashToken('token-secreto'), dataRevogacao: null },
      data: { dataRevogacao: expect.any(Date) as Date },
    });
  });
});
