import { PrismaService } from '../../../prisma/prisma.service';
import { EditarServicoService } from './editar-servico.service';
import { BuscarServicoService } from './buscar-servico.service';

describe('situação do serviço', () => {
  it('persiste false sem modificar itens históricos de agendamento', async () => {
    const prisma = { servico: { update: jest.fn().mockResolvedValue({ id: 7, ativo: false }) } };
    const buscar = { execute: jest.fn().mockResolvedValue({ id: 7 }) };
    const service = new EditarServicoService(
      prisma as unknown as PrismaService,
      buscar as unknown as BuscarServicoService,
    );
    await expect(service.execute(7, { ativo: false })).resolves.toMatchObject({ ativo: false });
    expect(prisma.servico.update).toHaveBeenCalledWith({
      where: { id: 7 },
      data: { ativo: false },
    });
  });
});
