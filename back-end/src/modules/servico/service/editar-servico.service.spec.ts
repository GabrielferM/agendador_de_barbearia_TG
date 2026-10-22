import { EditarServicoService } from './editar-servico.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { BuscarServicoService } from './buscar-servico.service';
import { AtualizarServicoDto } from '../dto/atualizar-servico.dto';
import { validate } from 'class-validator';

describe('Ativação de serviço', () => {
  it('persiste false sem alterar os itens históricos', async () => {
    const update = jest.fn().mockResolvedValue({ id: 1, ativo: false });
    const servico = new EditarServicoService(
      { servico: { update } } as unknown as PrismaService,
      { execute: jest.fn() } as unknown as BuscarServicoService,
    );
    await servico.execute(1, { ativo: false });
    expect(update).toHaveBeenCalledWith({ where: { id: 1 }, data: { ativo: false } });
  });
  it('rejeita booleano textual no PATCH', async () => {
    const dto = Object.assign(new AtualizarServicoDto(), { ativo: 'false' });
    expect(await validate(dto)).toEqual(
      expect.arrayContaining([expect.objectContaining({ property: 'ativo' })]),
    );
  });
});
