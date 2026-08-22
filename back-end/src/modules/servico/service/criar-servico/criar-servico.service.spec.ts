import { Prisma } from '@prisma/client';
import { CriarServicoService } from './criar-servico.service';

describe('CriarServicoService', () => {
  it('deve criar um serviço válido', async () => {
    const repository = {
      buscarPorNome: jest.fn().mockResolvedValue(null),
      criar: jest.fn().mockResolvedValue({
        id: 1,
        nome: 'Corte clássico',
        descricao: 'Corte masculino',
        preco: new Prisma.Decimal('80.00'),
        duracaoMinutos: 45,
      }),
    };

    const service = new CriarServicoService(repository as any);

    await expect(
      service.execute({
        nome: 'Corte clássico',
        descricao: 'Corte masculino',
        preco: 80,
        duracaoMinutos: 45,
      }),
    ).resolves.toMatchObject({
      nome: 'Corte clássico',
      duracaoMinutos: 45,
    });
  });
});
